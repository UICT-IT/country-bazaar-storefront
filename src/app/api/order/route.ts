import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import nodemailer from "nodemailer";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface OrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  total: number;
}

function generateOrderPdf(
  orderNumber: string,
  payload: OrderPayload,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Header
    doc
      .fillColor("#14532d")
      .fontSize(22)
      .text("COUNTRY BAZAAR MIDRAND", { align: "left" });
    doc
      .fillColor("#b91c1c")
      .fontSize(10)
      .text("Fresh Market & Deli • South Africa (ZAR)", { align: "left" });
    doc.moveDown();

    doc.fillColor("#111827").fontSize(13).text(`ORDER SLIP: #${orderNumber}`);
    doc
      .fontSize(10)
      .fillColor("#4b5563")
      .text(`Date: ${new Date().toLocaleString("en-ZA")}`);
    doc.moveDown();

    // Customer Box
    doc.rect(50, doc.y, 495, 95).fillAndStroke("#f9fafb", "#e5e7eb");
    const boxTop = doc.y + 10;
    doc
      .fillColor("#111827")
      .fontSize(11)
      .text("Customer & Delivery Details", 65, boxTop, { underline: true });
    doc.fontSize(10).fillColor("#374151");
    doc.text(`Name: ${payload.customer.fullName}`, 65, boxTop + 18);
    doc.text(`Phone: ${payload.customer.phone}`, 65, boxTop + 33);
    doc.text(`Address: ${payload.customer.address}`, 65, boxTop + 48);
    if (payload.customer.notes) {
      doc.text(`Notes: ${payload.customer.notes}`, 65, boxTop + 63);
    }

    doc.y = boxTop + 105;

    // Table Header
    const tableTop = doc.y;
    doc.fillColor("#14532d").fontSize(10);
    doc.text("Item", 50, tableTop);
    doc.text("Qty", 310, tableTop, { width: 55, align: "center" });
    doc.text("Unit Price", 370, tableTop, { width: 80, align: "right" });
    doc.text("Subtotal", 460, tableTop, { width: 85, align: "right" });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .strokeColor("#d1d5db")
      .stroke();

    let currentY = tableTop + 24;
    doc.fillColor("#1f2937").fontSize(10);

    payload.items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      doc.text(item.name, 50, currentY, { width: 250 });
      doc.text(`${item.quantity} ${item.unit}`, 310, currentY, {
        width: 55,
        align: "center",
      });
      doc.text(`R ${item.price.toFixed(2)}`, 370, currentY, {
        width: 80,
        align: "right",
      });
      doc.text(`R ${subtotal.toFixed(2)}`, 460, currentY, {
        width: 85,
        align: "right",
      });
      currentY += 22;
    });

    doc
      .moveTo(50, currentY + 5)
      .lineTo(545, currentY + 5)
      .strokeColor("#14532d")
      .stroke();
    doc
      .fontSize(13)
      .fillColor("#14532d")
      .text(`TOTAL: R ${payload.total.toFixed(2)}`, 350, currentY + 15, {
        width: 195,
        align: "right",
      });

    doc.end();
  });
}

export async function POST(req: Request) {
  try {
    const payload: OrderPayload = await req.json();

    if (
      !payload.items?.length ||
      !payload.customer?.fullName ||
      !payload.customer?.phone
    ) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 },
      );
    }

    const orderNumber = `CB-${Date.now().toString().slice(-6)}`;
    const pdfBuffer = await generateOrderPdf(orderNumber, payload);
    let emailSent = false;

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 465),
        secure: Number(process.env.SMTP_PORT || 465) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Country Bazaar Orders" <${process.env.SMTP_USER}>`,
        to: process.env.ORDER_RECEIVER_EMAIL || process.env.SMTP_USER,
        cc: payload.customer.email || undefined,
        subject: `New Order #${orderNumber} - ${payload.customer.fullName} (R ${payload.total.toFixed(2)})`,
        html: `
          <h2>New Order Received (#${orderNumber})</h2>
          <p><strong>Customer:</strong> ${payload.customer.fullName}</p>
          <p><strong>Phone:</strong> ${payload.customer.phone}</p>
          <p><strong>Address:</strong> ${payload.customer.address}</p>
          <p><strong>Total Amount:</strong> R ${payload.total.toFixed(2)}</p>
          <p>Detailed order slip is attached as a PDF.</p>
        `,
        attachments: [
          {
            filename: `CountryBazaar-Order-${orderNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
      emailSent = true;
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      emailSent,
      pdfBase64: pdfBuffer.toString("base64"),
    });
  } catch (error: any) {
    console.error("Order API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
      { status: 500 },
    );
  }
}
