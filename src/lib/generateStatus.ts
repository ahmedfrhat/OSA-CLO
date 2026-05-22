"use client";

/**
 * generateWhatsAppStatus
 * Pure client-side canvas (1080×1920 @ 9:16) — NO external libraries.
 * Draws a luxury black card and triggers a PNG download.
 */
export async function generateWhatsAppStatus(product: {
  name_en: string;
  selling_price: number;
  image_url?: string | null;
  category?: string | null;
}): Promise<void> {
  const W = 1080;
  const H = 1920;

  const canvas  = document.createElement("canvas");
  canvas.width  = W;
  canvas.height = H;
  const ctx     = canvas.getContext("2d")!;

  // ── 1. Background ────────────────────────────────────────────────────────────
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(0, 0, W, H);

  // Subtle noise grain overlay (pixel art trick — no image needed)
  ctx.globalAlpha = 0.03;
  for (let y = 0; y < H; y += 4) {
    for (let x = 0; x < W; x += 4) {
      if (Math.random() > 0.5) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }
  ctx.globalAlpha = 1;

  // ── 2. Thin white border ─────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth   = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // ── 3. Store name header ─────────────────────────────────────────────────────
  ctx.fillStyle    = "#FFFFFF";
  ctx.font         = "bold 52px Arial, sans-serif";
  ctx.textAlign    = "center";
  ctx.letterSpacing = "8px";
  ctx.fillText("ASO CLO", W / 2, 160);

  // Thin divider line
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(180, 200);
  ctx.lineTo(W - 180, 200);
  ctx.stroke();

  // Category tag
  if (product.category) {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font      = "400 28px Arial, sans-serif";
    ctx.fillText(product.category.toUpperCase(), W / 2, 260);
  }

  // ── 4. Product image ─────────────────────────────────────────────────────────
  const IMG_TOP    = 300;
  const IMG_SIZE   = 900;
  const IMG_LEFT   = (W - IMG_SIZE) / 2;

  if (product.image_url) {
    try {
      const img = await loadImage(product.image_url);
      // Draw image with contain-fit logic inside the box
      const { sx, sy, sw, sh, dx, dy, dw, dh } = coverFit(
        img.naturalWidth, img.naturalHeight,
        IMG_LEFT, IMG_TOP, IMG_SIZE, IMG_SIZE
      );
      ctx.save();
      // Clip to image box
      ctx.beginPath();
      ctx.rect(IMG_LEFT, IMG_TOP, IMG_SIZE, IMG_SIZE);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.restore();

      // Dark overlay at bottom of image for readability
      const grad = ctx.createLinearGradient(0, IMG_TOP + IMG_SIZE - 200, 0, IMG_TOP + IMG_SIZE);
      grad.addColorStop(0, "rgba(10,10,10,0)");
      grad.addColorStop(1, "rgba(10,10,10,0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(IMG_LEFT, IMG_TOP + IMG_SIZE - 200, IMG_SIZE, 200);
    } catch {
      // Image load failed — draw placeholder
      drawPlaceholder(ctx, IMG_LEFT, IMG_TOP, IMG_SIZE, IMG_SIZE, product.name_en);
    }
  } else {
    drawPlaceholder(ctx, IMG_LEFT, IMG_TOP, IMG_SIZE, IMG_SIZE, product.name_en);
  }

  // ── 5. Product name ──────────────────────────────────────────────────────────
  const TEXT_Y = IMG_TOP + IMG_SIZE + 80;
  ctx.fillStyle   = "#FFFFFF";
  ctx.font        = "bold 68px Arial, sans-serif";
  ctx.textAlign   = "center";
  ctx.letterSpacing = "2px";

  // Word wrap for long names
  const words     = product.name_en.toUpperCase().split(" ");
  const maxWidth  = W - 160;
  const lineHeight = 84;
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, TEXT_Y + i * lineHeight);
  });

  // ── 6. Price badge ───────────────────────────────────────────────────────────
  const PRICE_Y = TEXT_Y + lines.length * lineHeight + 60;
  const priceText = `EGP ${product.selling_price.toLocaleString("en-EG")}`;

  // Measure price badge width
  ctx.font = "bold 56px Arial, sans-serif";
  const priceWidth = ctx.measureText(priceText).width + 80;

  // Badge background
  ctx.fillStyle = "#FFFFFF";
  const bx = (W - priceWidth) / 2;
  ctx.fillRect(bx, PRICE_Y - 56, priceWidth, 76);

  // Price text
  ctx.fillStyle = "#0A0A0A";
  ctx.font      = "bold 56px Arial, sans-serif";
  ctx.fillText(priceText, W / 2, PRICE_Y);

  // ── 7. Footer ────────────────────────────────────────────────────────────────
  const FOOTER_Y = H - 160;
  ctx.fillStyle  = "rgba(255,255,255,0.25)";
  ctx.font       = "400 30px Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("ORDER NOW", W / 2, FOOTER_Y);

  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.font      = "400 24px Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText("DM us on Instagram & WhatsApp", W / 2, FOOTER_Y + 50);

  // ── 8. Download ──────────────────────────────────────────────────────────────
  const link     = document.createElement("a");
  const safeName = product.name_en.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  link.download  = `${safeName}-status.png`;
  link.href      = canvas.toDataURL("image/png");
  link.click();
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src     = src;
  });
}

/** Cover-fit: fills the box while maintaining aspect ratio (like object-fit: cover) */
function coverFit(
  iw: number, ih: number,
  dx: number, dy: number, dw: number, dh: number
) {
  const scaleX = dw / iw;
  const scaleY = dh / ih;
  const scale  = Math.max(scaleX, scaleY);
  const sw     = dw  / scale;
  const sh     = dh  / scale;
  const sx     = (iw - sw) / 2;
  const sy     = (ih - sh) / 2;
  return { sx, sy, sw, sh, dx, dy, dw, dh };
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  name: string
) {
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font      = "bold 160px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name.slice(0, 2).toUpperCase(), x + w / 2, y + h / 2 + 56);
}
