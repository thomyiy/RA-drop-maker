#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Jewel Memories — Dossier de maquettes (mockups) du site.
Direction artistique : éditoriale joaillerie ("Thelma West"-like).
Génère un PDF vectoriel, une page par écran du site.
"""
import os
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONTS = "/mnt/skills/examples/canvas-design/canvas-fonts"

def reg(name, fn):
    pdfmetrics.registerFont(TTFont(name, os.path.join(FONTS, fn)))

reg("Display",  "Italiana-Regular.ttf")      # grands titres éditoriaux
reg("Serif",    "InstrumentSerif-Regular.ttf")
reg("SerifIt",  "InstrumentSerif-Italic.ttf")
reg("Quote",    "CrimsonPro-Italic.ttf")
reg("Sans",     "Outfit-Regular.ttf")
reg("SansB",    "Outfit-Bold.ttf")

# ---- Palette (neutres chauds + or, héritée de la marque, élevée) ----
CREAM    = HexColor("#F5F0E8")
PAPER    = HexColor("#FBF8F2")
WHITE    = HexColor("#FFFFFF")
INK      = HexColor("#1C1A17")
INK_SOFT = HexColor("#5A554C")
GOLD     = HexColor("#B08D57")
GOLD_DK  = HexColor("#8A6D3F")
GOLD_SF  = HexColor("#C9AD83")
SAND     = HexColor("#EFE8DC")
LINE     = HexColor("#E3DCCF")
LINE_DK  = HexColor("#D6CCBA")

W = 1280  # largeur de page (points)

class P:
    """Recorder top-down : on enregistre les ops, on flush avec la hauteur connue."""
    def __init__(self):
        self.ops = []
    def rect(self, x, y, w, h, fill=None, stroke=None, sw=1, radius=0):
        def fn(c):
            if fill: c.setFillColor(fill)
            if stroke: c.setStrokeColor(stroke); c.setLineWidth(sw)
            f = 1 if fill else 0; s = 1 if stroke else 0
            if radius > 0: c.roundRect(x, y, w, h, radius, stroke=s, fill=f)
            else: c.rect(x, y, w, h, stroke=s, fill=f)
        self.ops.append(fn)
    def line(self, x1, y1, x2, y2, color, w=1, dash=None):
        def fn(c):
            c.setStrokeColor(color); c.setLineWidth(w)
            if dash: c.setDash(dash, 0)
            c.line(x1, y1, x2, y2)
            if dash: c.setDash([], 0)
        self.ops.append(fn)
    def ellipse(self, x1, y1, x2, y2, fill=None, stroke=None, sw=1):
        def fn(c):
            if fill: c.setFillColor(fill)
            if stroke: c.setStrokeColor(stroke); c.setLineWidth(sw)
            c.ellipse(x1, y1, x2, y2, stroke=1 if stroke else 0, fill=1 if fill else 0)
        self.ops.append(fn)
    def circle(self, cx, cy, r, fill=None, stroke=None, sw=1):
        self.ellipse(cx-r, cy-r, cx+r, cy+r, fill, stroke, sw)
    def text(self, x, y, s, font, size, color, align='l', tracking=0):
        def fn(c):
            c.saveState(); c.translate(x, y); c.scale(1, -1)
            to = c.beginText()
            to.setFont(font, size); to.setFillColor(color)
            if tracking: to.setCharSpace(tracking)
            tw = pdfmetrics.stringWidth(s, font, size) + tracking*max(len(s)-1, 0)
            ox = 0 if align == 'l' else (-tw if align == 'r' else -tw/2)
            to.setTextOrigin(ox, 0)
            to.textLine(s)
            c.drawText(to)
            c.restoreState()
        self.ops.append(fn)
    def flush(self, c):
        # hauteur = position basse max
        pass

def text_w(s, font, size, tracking=0):
    return pdfmetrics.stringWidth(s, font, size) + tracking*max(len(s)-1, 0)

def wrap(s, font, size, maxw):
    words = s.split()
    lines, cur = [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if text_w(t, font, size) <= maxw:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w_
    if cur: lines.append(cur)
    return lines

def paragraph(p, x, y, s, font, size, color, maxw, leading, align='l'):
    """Dessine un paragraphe, renvoie le y (baseline) après la dernière ligne."""
    for ln in wrap(s, font, size, maxw):
        if align == 'c':
            p.text(x + maxw/2, y, ln, font, size, color, align='c')
        else:
            p.text(x, y, ln, font, size, color)
        y += leading
    return y

def eyebrow(p, x, y, s, align='l', color=GOLD_DK):
    p.text(x, y, s.upper(), "Sans", 9.5, color, align=align, tracking=2.4)

def pill_button(p, x, y, w, h, label, kind="primary"):
    """Bouton arrondi (primary = ink plein, outline = bordure)."""
    if kind == "primary":
        p.rect(x, y, w, h, fill=INK, radius=h/2)
        p.text(x+w/2, y+h/2+4, label, "Sans", 12.5, CREAM, align='c', tracking=0.6)
    elif kind == "gold":
        p.rect(x, y, w, h, fill=GOLD, radius=h/2)
        p.text(x+w/2, y+h/2+4, label, "Sans", 12.5, WHITE, align='c', tracking=0.6)
    else:
        p.rect(x, y, w, h, stroke=INK, sw=1.2, radius=h/2)
        p.text(x+w/2, y+h/2+4, label, "Sans", 12.5, INK, align='c', tracking=0.6)

def pendant(p, cx, top, d, initial="A", chain=True):
    """Petit motif line-art : médaillon gravé + chaîne. d = diamètre médaillon."""
    r = d/2
    cy = top + r + (40 if chain else 0)
    if chain:
        # chaîne en arc
        steps = 26
        import math
        for i in range(steps):
            t = i/(steps-1)
            ax = cx + (t-0.5)*d*1.5
            ay = top + 44 - math.sin(t*math.pi)*40
            p.circle(ax, ay, 1.6, stroke=GOLD, sw=1)
        # bélière
        p.circle(cx, cy-r-6, 5, stroke=GOLD, sw=1.4)
    # médaillon
    p.circle(cx, cy, r, fill=PAPER, stroke=GOLD, sw=1.6)
    p.circle(cx, cy, r-7, stroke=LINE_DK, sw=0.8)
    # initiale gravée
    p.text(cx, cy+r*0.34, initial, "Display", d*0.62, INK, align='c')
    return cy + r

# ---- chrome navigateur + header/footer du site ----
NAV = ["Modèles", "Comment ça marche", "Qualité", "FAQ"]

def browser_top(p, top, url):
    """Barre de navigateur minimaliste."""
    bh = 38
    p.rect(0, top, W, bh, fill=SAND)
    for i, col in enumerate([HexColor("#D9836B"), HexColor("#E0B25C"), HexColor("#9FB37E")]):
        p.circle(26+i*18, top+bh/2, 5, fill=col)
    p.rect(86, top+8, W-86-30, bh-16, fill=PAPER, radius=(bh-16)/2)
    p.text(104, top+bh/2+3.5, url, "Sans", 10.5, INK_SOFT)
    return top + bh

def site_header(p, top):
    """En-tête du site (logo + nav + CTA)."""
    hh = 64
    p.rect(0, top, W, hh, fill=PAPER)
    p.line(0, top+hh, W, top+hh, LINE, 1)
    # logo : pendentif + wordmark
    lx = 56
    p.circle(lx, top+hh/2, 9, stroke=GOLD, sw=1.6)
    p.text(lx, top+hh/2+4, "J", "Display", 12, INK, align='c')
    p.text(lx+22, top+hh/2+5.5, "Jewel Memories", "Display", 20, INK)
    # nav
    nx = 470
    for item in NAV:
        p.text(nx, top+hh/2+4.5, item, "Sans", 12.5, INK_SOFT)
        nx += text_w(item, "Sans", 12.5) + 38
    # CTA
    pill_button(p, W-56-184, top+hh/2-17, 184, 34, "Créer mon pendentif", "primary")
    return top + hh

def site_footer(p, top):
    """Pied de page du site."""
    fh = 190
    p.rect(0, top, W, fh, fill=INK)
    x = 56
    p.circle(x, top+46, 9, stroke=GOLD_SF, sw=1.5)
    p.text(x, top+50, "J", "Display", 12, CREAM, align='c')
    p.text(x+22, top+51, "Jewel Memories", "Display", 20, CREAM)
    p.text(x, top+82, "Vos souvenirs, gravés pour toujours.", "Sans", 11.5, GOLD_SF)
    cols = [
        ("Créer", ["Configurateur", "Modèles", "Comment ça marche"]),
        ("La maison", ["Qualité", "FAQ", "Instagram"]),
        ("Informations", ["CGV", "Confidentialité", "Mentions légales"]),
    ]
    cx = 640
    for title, items in cols:
        eyebrow(p, cx, top+40, title, color=GOLD_SF)
        yy = top+64
        for it in items:
            p.text(cx, yy, it, "Sans", 11.5, HexColor("#C9C3B7"))
            yy += 22
        cx += 210
    p.line(56, top+fh-44, W-56, top+fh-44, HexColor("#3A352D"), 1)
    p.text(56, top+fh-22, "© 2026 Jewel Memories — Fabrication artisanale française", "Sans", 10, HexColor("#8C867A"))
    p.text(W-56, top+fh-22, "Paiement sécurisé · Stripe", "Sans", 10, HexColor("#8C867A"), align='r')
    return top + fh

def page_number(p, H, n, label):
    p.text(56, H-26, f"Jewel Memories — Dossier maquettes", "Sans", 9, HexColor("#A89F8E"), tracking=1.5)
    p.text(W-56, H-26, f"{label}   ·   {n:02d}", "Sans", 9, HexColor("#A89F8E"), align='r', tracking=1.5)

def star(p, cx, cy, r, color):
    import math
    pts = []
    for i in range(10):
        ang = -math.pi/2 + i*math.pi/5
        rr = r if i % 2 == 0 else r*0.42
        pts.append((cx + rr*math.cos(ang), cy + rr*math.sin(ang)))
    def fn(c):
        c.setFillColor(color)
        path = c.beginPath(); path.moveTo(*pts[0])
        for q in pts[1:]: path.lineTo(*q)
        path.close(); c.drawPath(path, fill=1, stroke=0)
    p.ops.append(fn)

def stars(p, x, y, n, r, color, gap=5):
    for i in range(n):
        star(p, x + r + i*(2*r+gap), y, r, color)

def diamond(p, cx, cy, s, color):
    def fn(c):
        c.setFillColor(color)
        path = c.beginPath()
        path.moveTo(cx, cy-s); path.lineTo(cx+s, cy); path.lineTo(cx, cy+s); path.lineTo(cx-s, cy)
        path.close(); c.drawPath(path, fill=1, stroke=0)
    p.ops.append(fn)

def price(p, x, y, s, size, color, align='l'):
    """Prix avec € garanti (Instrument Serif)."""
    p.text(x, y, s, "Serif", size, color, align=align)

def caption_bar(p, top, label, n):
    h = 42
    p.rect(0, top, W, h, fill=CREAM)
    p.line(0, top, W, top, LINE_DK, 1)
    p.text(56, top+26, "Jewel Memories — Maquettes du site", "Sans", 9.5, HexColor("#9A9180"), tracking=1.4)
    p.text(W-56, top+26, f"{label.upper()}    ·    {n:02d}", "Sans", 9.5, HexColor("#9A9180"), align='r', tracking=1.8)
    return top + h

# =====================================================================
#  PAGES
# =====================================================================
def render(c, builder):
    p = P()
    H = builder(p)
    c.setPageSize((W, H))
    c.saveState()
    c.translate(0, H); c.scale(1, -1)
    for fn in p.ops: fn(c)
    c.restoreState()
    c.showPage()

# ---------- 1. COUVERTURE ----------
def cover(p):
    H = 900
    p.rect(0, 0, W, H, fill=CREAM)
    # cadre fin
    m = 40
    p.rect(m, m, W-2*m, H-2*m, stroke=LINE_DK, sw=1)
    eyebrow(p, W/2, 150, "Dossier de direction artistique · 2026", align='c')
    p.text(W/2, 300, "Jewel Memories", "Display", 96, INK, align='c')
    p.text(W/2, 348, "Maquettes du site", "SerifIt", 30, GOLD_DK, align='c')
    p.line(W/2-60, 392, W/2+60, 392, GOLD, 1)
    pendant(p, W/2, 430, 120, "J")
    para = "Bijoux gravés sur mesure d’après vos souvenirs. Une identité éditoriale, " \
           "chaleureuse et précieuse — grandes images, typographie sérif, et beaucoup d’air."
    paragraph(p, W/2-300, 690, para, "Sans", 13, INK_SOFT, 600, 22, align='c')
    p.text(W/2, 800, "ARGENT 925   ·   ACIER DORÉ   ·   OR 18K", "Sans", 10, GOLD_DK, align='c', tracking=3)
    return H

MARGIN = 72

def band(p, top, h, color):
    p.rect(0, top, W, h, fill=color)

def section_head(p, top, eb, title, sub=None, sub_w=760, title_size=42):
    y = top
    if eb:
        eyebrow(p, W/2, y, eb, align='c'); y += 34
    p.text(W/2, y + title_size*0.72, title, "Display", title_size, INK, align='c')
    y += title_size + 14
    if sub:
        y = paragraph(p, W/2 - sub_w/2, y + 20, sub, "Sans", 13.5, INK_SOFT, sub_w, 22, align='c') - 8
    return y

def draw_shape(p, cx, cy, kind, s):
    """Silhouette de pendentif (line-art) centrée en (cx,cy), taille s."""
    import math
    p.circle(cx, cy - s*0.62, 4.5, stroke=GOLD, sw=1.3)   # bélière
    if kind == "round":
        p.circle(cx, cy, s*0.5, fill=PAPER, stroke=GOLD, sw=1.6)
        p.circle(cx, cy, s*0.5-6, stroke=LINE_DK, sw=0.7)
    elif kind == "rect":
        w_, h_ = s*0.74, s*1.04
        p.rect(cx-w_/2, cy-h_/2, w_, h_, fill=PAPER, stroke=GOLD, sw=1.6, radius=7)
        p.rect(cx-w_/2+6, cy-h_/2+6, w_-12, h_-12, stroke=LINE_DK, sw=0.7, radius=4)
    elif kind == "heart":
        r = s*0.27
        p.circle(cx-r*0.92, cy-r*0.5, r, fill=PAPER, stroke=GOLD, sw=1.6)
        p.circle(cx+r*0.92, cy-r*0.5, r, fill=PAPER, stroke=GOLD, sw=1.6)
        # pointe basse (triangle plein crème pour masquer)
        def fn(c):
            c.setFillColor(PAPER); c.setStrokeColor(GOLD); c.setLineWidth(1.6)
            pth = c.beginPath()
            pth.moveTo(cx-r*1.84, cy-r*0.5); pth.lineTo(cx, cy+r*1.5); pth.lineTo(cx+r*1.84, cy-r*0.5)
            c.drawPath(pth, stroke=1, fill=1)
        p.ops.append(fn)
        # recouvre le haut des cercles pour fusion propre
        p.line(cx-r*1.84, cy-r*0.5, cx+r*1.84, cy-r*0.5, PAPER, 3)
    elif kind == "oval":
        w_, h_ = s*0.62, s*0.92
        p.ellipse(cx-w_/2, cy-h_/2, cx+w_/2, cy+h_/2, fill=PAPER, stroke=GOLD, sw=1.6)
        p.ellipse(cx-w_/2+6, cy-h_/2+6, cx+w_/2-6, cy+h_/2-6, stroke=LINE_DK, sw=0.7)

# ---------- 2. DESIGN SYSTEM ----------
def design_system(p):
    cur = 0
    band(p, 0, 1180, CREAM)
    cur = 90
    eyebrow(p, W/2, cur, "Système de design", align='c'); cur += 36
    p.text(W/2, cur+30, "Les fondamentaux", "Display", 46, INK, align='c'); cur += 86
    p.line(W/2-40, cur, W/2+40, cur, GOLD, 1); cur += 60

    # --- Palette ---
    eyebrow(p, MARGIN, cur, "Palette")
    cur += 30
    swatches = [
        ("Encre", "#1C1A17", INK, True), ("Encre douce", "#5A554C", INK_SOFT, True),
        ("Crème", "#F5F0E8", CREAM, False), ("Sable", "#EFE8DC", SAND, False),
        ("Or", "#B08D57", GOLD, True), ("Or foncé", "#8A6D3F", GOLD_DK, True),
    ]
    sw_w = (W - 2*MARGIN - 5*20) / 6
    for i, (nm, hx, col, dark) in enumerate(swatches):
        x = MARGIN + i*(sw_w+20)
        p.rect(x, cur, sw_w, 96, fill=col, stroke=LINE_DK if not dark else None, sw=1, radius=8)
        p.text(x+14, cur+58, nm, "Sans", 12, WHITE if dark else INK)
        p.text(x+14, cur+78, hx, "Sans", 10, (HexColor('#D9CDB8') if dark else INK_SOFT))
    cur += 96 + 70

    # --- Typographie ---
    eyebrow(p, MARGIN, cur, "Typographie"); cur += 60
    p.text(MARGIN, cur, "Italiana", "Display", 64, INK);
    p.text(MARGIN+360, cur-28, "Titres éditoriaux — display sérif", "Sans", 12, INK_SOFT)
    p.text(MARGIN+360, cur-8, "Aa Bb Cc · 0123456789", "Display", 22, GOLD_DK)
    cur += 48
    p.line(MARGIN, cur, W-MARGIN, cur, LINE, 1); cur += 46
    p.text(MARGIN, cur, "Instrument Serif — accents & citations", "SerifIt", 30, INK)
    cur += 46
    p.text(MARGIN, cur, "Outfit — texte courant, interface, libellés", "Sans", 22, INK_SOFT)
    cur += 30
    eyebrow(p, MARGIN, cur, "Outfit · capitales espacées — surtitres")
    cur += 56

    # --- Composants ---
    p.line(MARGIN, cur, W-MARGIN, cur, LINE, 1); cur += 40
    eyebrow(p, MARGIN, cur, "Composants"); cur += 32
    pill_button(p, MARGIN, cur, 200, 46, "Créer mon pendentif", "primary")
    pill_button(p, MARGIN+224, cur, 160, 46, "Voir les modèles", "outline")
    pill_button(p, MARGIN+408, cur, 190, 46, "Procéder au paiement", "gold")
    # carte produit miniature
    cardx = W - MARGIN - 220
    p.rect(cardx, cur-10, 220, 150, fill=PAPER, stroke=LINE, sw=1, radius=12)
    draw_shape(p, cardx+60, cur+60, "round", 80)
    p.text(cardx+120, cur+40, "Médaille ronde", "Serif", 17, INK)
    p.text(cardx+120, cur+62, "Argent 925", "Sans", 11, INK_SOFT)
    price(p, cardx+120, cur+92, "dès 59 €", 22, GOLD_DK)
    cur += 175

    H = cur + 70
    page_number(p, H, 1, "Design system")
    return H

# ---------- 3. HOMEPAGE ----------
def homepage(p):
    cur = 0
    cur = browser_top(p, cur, "jewel-memories.fr")
    cur = site_header(p, cur)

    # HERO
    hero_h = 486
    band(p, cur, hero_h, CREAM)
    hx = MARGIN
    hy = cur + 96
    eyebrow(p, hx, hy, "Bijoux gravés sur mesure"); hy += 46
    p.text(hx, hy, "Un souvenir.", "Display", 62, INK); hy += 64
    p.text(hx, hy, "Un bijou gravé", "Display", 62, INK); hy += 64
    p.text(hx, hy, "pour toujours.", "Display", 62, GOLD_DK); hy += 44
    sub = "Transformez un prénom, une photo ou un symbole qui compte en un pendentif " \
          "gravé à la main. Composez-le en ligne, prévisualisez le rendu, et recevez " \
          "votre pièce sous écrin."
    hy = paragraph(p, hx, hy, sub, "Sans", 14, INK_SOFT, 470, 23) + 16
    pill_button(p, hx, hy, 210, 50, "Créer mon pendentif", "primary")
    p.text(hx+232, hy+31, "Comment ça marche  →", "Sans", 13, INK)
    hy += 78
    diamond(p, hx+4, hy-4, 4, GOLD)
    p.text(hx+18, hy, "Fabrication artisanale   ·   Livraison 7–10 j   ·   Écrin offert",
           "Sans", 11.5, GOLD_DK, tracking=0.4)
    # hero visual panel
    px0 = W - MARGIN - 420
    p.rect(px0, cur+70, 420, hero_h-140, fill=SAND, stroke=LINE_DK, sw=1, radius=18)
    pendant(p, px0+210, cur+150, 130, "M")
    p.text(px0+210, cur+hero_h-138, "Aperçu de la gravure", "SerifIt", 18, GOLD_DK, align='c')
    p.text(px0+210, cur+hero_h-112, "line art · noir & blanc", "Sans", 11, INK_SOFT, align='c')
    cur += hero_h

    # COMMENT CA MARCHE
    sec_h = 366
    band(p, cur, sec_h, PAPER)
    top = section_head(p, cur+58, "Comment ça marche", "De votre souvenir au bijou, en 4 étapes",
                       "Un parcours simple et guidé, entièrement en ligne.")
    steps = [
        ("01", "Choisissez votre support", "Forme du pendentif, matière (argent, acier doré, or) et chaîne assortie."),
        ("02", "Composez la gravure", "Texte, photo ou symbole : prévisualisez le rendu en direct sur votre bijou."),
        ("03", "Nous gravons à la main", "Chaque pièce est gravée au laser dans notre atelier, puis contrôlée une à une."),
        ("04", "Livraison soignée", "Votre bijou arrive sous écrin, prêt à offrir, en 7 à 10 jours ouvrés."),
    ]
    sw_ = (W - 2*MARGIN - 3*32) / 4
    sy = top + 46
    for i, (n, t, b) in enumerate(steps):
        x = MARGIN + i*(sw_+32)
        p.text(x, sy, n, "Display", 34, GOLD_SF)
        p.line(x, sy+14, x+28, sy+14, GOLD, 1)
        p.text(x, sy+48, t, "Serif", 19, INK)
        paragraph(p, x, sy+72, b, "Sans", 12, INK_SOFT, sw_-6, 18)
    cur += sec_h

    # MODES DE GRAVURE
    sec_h = 388
    band(p, cur, sec_h, CREAM)
    top = section_head(p, cur+58, "Personnalisation", "Trois façons de graver votre histoire",
                       "Photo en line art, texte ou symbole : choisissez le mode qui raconte votre souvenir.")
    modes = [
        ("Photo en line art", "Votre photo transformée en trait",
         "Importez une photo : notre IA la transforme en line art noir & blanc, prêt à graver. L’effet signature de Jewel Memories."),
        ("Texte gravé", "Un prénom, une date, un mot",
         "Gravez un prénom, une date ou un message court. Choisissez la police, la taille et la position."),
        ("Symbole", "Cœur, infini, signe astral…",
         "Sélectionnez un motif dans notre bibliothèque de symboles et composez votre pendentif."),
    ]
    cw = (W - 2*MARGIN - 2*30) / 3
    cy0 = top + 40
    icons = ["round", "rect", "heart"]
    for i, (t, s_, b) in enumerate(modes):
        x = MARGIN + i*(cw+30)
        p.rect(x, cy0, cw, 196, fill=PAPER, stroke=LINE, sw=1, radius=14)
        draw_shape(p, x+52, cy0+58, icons[i], 56)
        p.text(x+96, cy0+44, t, "Serif", 20, INK)
        p.text(x+96, cy0+66, s_, "Sans", 11, GOLD_DK)
        paragraph(p, x+28, cy0+110, b, "Sans", 12, INK_SOFT, cw-56, 18)
    cur += sec_h

    # MODELES
    sec_h = 430
    band(p, cur, sec_h, PAPER)
    top = section_head(p, cur+58, "Nos modèles", "Des supports pensés pour durer",
                       "Argent 925, acier doré ou or 18k — chaque forme est gravable selon vos envies.")
    models = [("round","Médaille ronde","Ø 18 mm","59 €"),
              ("rect","Plaque rectangle","25 × 15 mm","64 €"),
              ("heart","Cœur","17 mm","62 €"),
              ("oval","Médaillon ovale","22 × 16 mm","66 €")]
    mw = (W - 2*MARGIN - 3*28) / 4
    my = top + 40
    for i, (k, nm, meta, pr) in enumerate(models):
        x = MARGIN + i*(mw+28)
        p.rect(x, my, mw, 200, fill=CREAM, stroke=LINE, sw=1, radius=14)
        draw_shape(p, x+mw/2, my+78, k, 92)
        p.text(x+mw/2, my+150, nm, "Serif", 18, INK, align='c')
        p.text(x+mw/2, my+170, meta, "Sans", 10.5, INK_SOFT, align='c')
        price(p, x+mw/2, my+193, "dès "+pr, 20, GOLD_DK, align='c')
    pill_button(p, W/2-100, my+228, 200, 46, "Voir tous les modèles", "outline")
    cur += sec_h

    # TEMOIGNAGES
    sec_h = 348
    band(p, cur, sec_h, SAND)
    top = section_head(p, cur+52, "Avis clients", "Ils ont gravé leur souvenir", None, title_size=38)
    quotes = [
        ("J’ai fait graver le prénom de ma fille. Le rendu est délicat et la qualité irréprochable.", "Camille R."),
        ("Un cadeau parfait pour les 30 ans de mon compagnon. L’écrin et la finition font la différence.", "Sophie L."),
        ("Service au top, livraison rapide, et la gravure est exactement comme sur l’aperçu.", "Marc D."),
    ]
    qw = (W - 2*MARGIN - 2*28) / 3
    qy = top + 38
    for i, (q, a) in enumerate(quotes):
        x = MARGIN + i*(qw+28)
        p.rect(x, qy, qw, 150, fill=PAPER, stroke=LINE, sw=1, radius=12)
        stars(p, x+24, qy+40, 5, 5.5, GOLD, 5)
        yy = paragraph(p, x+24, qy+74, q, "Quote", 15, INK, qw-48, 20)
        p.text(x+24, qy+128, "— "+a, "Sans", 11, GOLD_DK)
    cur += sec_h

    # CTA FINAL
    sec_h = 220
    band(p, cur, sec_h, INK)
    p.text(W/2, cur+92, "Et si votre prochain souvenir", "Display", 40, CREAM, align='c')
    p.text(W/2, cur+136, "devenait un bijou ?", "Display", 40, GOLD_SF, align='c')
    pill_button(p, W/2-105, cur+160, 210, 48, "Créer mon pendentif", "gold")
    cur += sec_h

    cur = site_footer(p, cur)
    cur = caption_bar(p, cur, "Accueil", 1)
    return cur

# ---------- generic interior page scaffold ----------
def interior(p, url, eb, title, sub, body_fn, label, num):
    cur = 0
    cur = browser_top(p, cur, url)
    cur = site_header(p, cur)
    # page header band
    ph = 188
    band(p, cur, ph, SAND)
    top = cur + 56
    eyebrow(p, W/2, top, eb, align='c'); top += 34
    p.text(W/2, top+30, title, "Display", 46, INK, align='c'); top += 52
    if sub:
        paragraph(p, W/2-360, top+22, sub, "Sans", 13.5, INK_SOFT, 720, 22, align='c')
    cur += ph
    band(p, cur, 10, PAPER)
    cur += 10
    cur = body_fn(p, cur)
    cur = site_footer(p, cur)
    cur = caption_bar(p, cur, label, num)
    return cur

# ---------- 4. MODELES ----------
def modeles(p):
    def body(p, cur):
        band(p, cur, 760, PAPER)
        my = cur + 50
        models = [("round","Médaille ronde","Ronde · Ø 18 mm","59 €"),
                  ("rect","Plaque rectangle","Rectangle · 25 × 15 mm","64 €"),
                  ("heart","Cœur","Cœur · 17 mm","62 €"),
                  ("oval","Médaillon ovale","Ovale · 22 × 16 mm","66 €")]
        mw = (W - 2*MARGIN - 3*28) / 4
        for i, (k, nm, meta, pr) in enumerate(models):
            x = MARGIN + i*(mw+28)
            p.rect(x, my, mw, 250, fill=CREAM, stroke=LINE, sw=1, radius=14)
            draw_shape(p, x+mw/2, my+92, k, 104)
            p.text(x+mw/2, my+178, nm, "Serif", 19, INK, align='c')
            p.text(x+mw/2, my+200, meta, "Sans", 10.5, INK_SOFT, align='c')
            price(p, x+mw/2, my+228, "dès "+pr, 21, GOLD_DK, align='c')
        my += 250 + 70
        # matières
        eyebrow(p, MARGIN, my, "Les matières");
        p.text(MARGIN, my+44, "Sélectionnez la matière qui vous ressemble", "Display", 30, INK)
        my += 84
        mats = [("Argent 925", "Argent massif, gravure nette et lumineuse.", "Inclus"),
                ("Acier doré", "Acier inoxydable plaqué or, résistant au quotidien.", "+ 10 €"),
                ("Or jaune 18k", "Or massif 18 carats, pour les pièces d’exception.", "+ 280 €")]
        for nm, desc, pr in mats:
            p.rect(MARGIN, my, W-2*MARGIN, 66, fill=CREAM, stroke=LINE, sw=1, radius=10)
            p.circle(MARGIN+38, my+33, 14, fill=GOLD_SF if nm!="Argent 925" else SAND, stroke=GOLD, sw=1.2)
            p.text(MARGIN+72, my+30, nm, "Serif", 18, INK)
            p.text(MARGIN+72, my+50, desc, "Sans", 12, INK_SOFT)
            price(p, W-MARGIN-28, my+44, pr, 20, GOLD_DK, align='r')
            my += 80
        my += 10
        pill_button(p, W/2-110, my, 220, 48, "Personnaliser mon pendentif", "primary")
        return cur + 760
    return interior(p, "jewel-memories.fr/modeles", "Nos modèles", "Choisissez votre support",
                    "Chaque forme est gravable. Sélectionnez la matière qui vous ressemble.", body, "Modèles", 2)

# ---------- 5. CONFIGURATEUR ----------
def configurateur(p):
    BODY_H = 600
    def body(p, cur):
        band(p, cur, BODY_H, PAPER)
        gap = 44
        leftw = (W - 2*MARGIN - gap) * 0.50
        rightw = (W - 2*MARGIN - gap) - leftw
        lx = MARGIN
        rx = MARGIN + leftw + gap
        top = cur + 46
        # --- LEFT : choices ---
        ly = top
        eyebrow(p, lx, ly, "1 · Support"); ly += 20
        shapes = [("round", "Ronde"), ("rect", "Plaque"), ("heart", "Cœur"), ("oval", "Ovale")]
        bw = (leftw - 3*14)/4
        for i, (k, nm) in enumerate(shapes):
            x = lx + i*(bw+14); sel = (i == 0)
            p.rect(x, ly, bw, 92, fill=(SAND if sel else CREAM),
                   stroke=(GOLD if sel else LINE), sw=(1.8 if sel else 1), radius=10)
            draw_shape(p, x+bw/2, ly+40, k, 42)
            p.text(x+bw/2, ly+82, nm, "Sans", 10.5, INK if sel else INK_SOFT, align='c')
        ly += 92 + 34
        eyebrow(p, lx, ly, "2 · Matière"); ly += 20
        mats = [("Argent 925", "Inclus"), ("Acier doré", "+10 €"), ("Or 18k", "+280 €")]
        bw2 = (leftw - 2*14)/3
        for i, (nm, pr) in enumerate(mats):
            x = lx + i*(bw2+14); sel = (i == 0)
            p.rect(x, ly, bw2, 64, fill=(SAND if sel else CREAM),
                   stroke=(GOLD if sel else LINE), sw=(1.8 if sel else 1), radius=10)
            p.text(x+bw2/2, ly+30, nm, "Sans", 12.5, INK, align='c')
            price(p, x+bw2/2, ly+50, pr, 11.5, GOLD_DK, align='c')
        ly += 64 + 34
        eyebrow(p, lx, ly, "3 · Votre photo"); ly += 20
        p.rect(lx, ly, leftw, 132, fill=CREAM, stroke=GOLD, sw=1.3, radius=12)
        cxp = lx+leftw/2
        p.circle(cxp, ly+50, 17, stroke=GOLD, sw=1.4)
        p.line(cxp-7, ly+50, cxp+7, ly+50, GOLD, 1.6)
        p.line(cxp, ly+43, cxp, ly+57, GOLD, 1.6)
        p.text(cxp, ly+88, "Glissez une photo ou cliquez pour importer", "Sans", 12.5, INK, align='c')
        p.text(cxp, ly+109, "PNG ou JPEG — convertie en line art par notre IA", "Sans", 10.5, GOLD_DK, align='c')
        # --- RIGHT : live preview ---
        ph = BODY_H - 92
        p.rect(rx, top, rightw, ph, fill=CREAM, stroke=LINE, sw=1, radius=16)
        eyebrow(p, rx+28, top+34, "Aperçu en direct")
        pendant(p, rx+rightw/2, top+78, 150, "L")
        p.line(rx+28, top+ph-128, rx+rightw-28, top+ph-128, LINE, 1)
        p.text(rx+28, top+ph-96, "Cœur · Argent 925", "Serif", 18, INK)
        p.text(rx+28, top+ph-74, "Gravure : photo en line art", "Sans", 11.5, INK_SOFT)
        price(p, rx+rightw-28, top+ph-86, "62 €", 30, GOLD_DK, align='r')
        pill_button(p, rx+28, top+ph-52, rightw-56, 46, "Procéder au paiement", "primary")
        return cur + BODY_H
    return interior(p, "jewel-memories.fr/configurateur", "L’atelier", "Composez votre pendentif",
                    "Choisissez votre support, votre matière, puis importez une photo : notre IA la transforme en line art, prêt à graver.",
                    body, "Configurateur", 3)

# ---------- 6. COMMENT CA MARCHE ----------
def comment_ca_marche(p):
    def body(p, cur):
        h = 700
        band(p, cur, h, PAPER)
        y = cur + 64
        steps = [
            ("01", "Choisissez votre support", "Forme du pendentif, matière (argent, acier doré, or 18k) et chaîne assortie. Tout commence par la pièce qui vous ressemble."),
            ("02", "Composez la gravure", "Texte, photo ou symbole : importez votre image, notre IA la transforme en line art, et vous prévisualisez le rendu en direct sur le bijou."),
            ("03", "Nous gravons à la main", "Chaque pièce est gravée au laser dans notre atelier, puis contrôlée une à une avant l’expédition."),
            ("04", "Livraison soignée", "Votre bijou arrive sous écrin, prêt à offrir, en 7 à 10 jours ouvrés. Emballage soigné et matériaux recyclables."),
        ]
        rowh = 132
        for i, (n, t, b) in enumerate(steps):
            p.text(MARGIN, y+46, n, "Display", 48, GOLD_SF)
            p.text(MARGIN+120, y+28, t, "Serif", 25, INK)
            paragraph(p, MARGIN+120, y+58, b, "Sans", 13.5, INK_SOFT, W-2*MARGIN-120-260, 22)
            draw_shape(p, W-MARGIN-90, y+52, ["round","rect","heart","oval"][i], 60)
            if i < 3:
                p.line(MARGIN, y+rowh-14, W-MARGIN, y+rowh-14, LINE, 1)
            y += rowh
        y += 24
        pill_button(p, W/2-105, y, 210, 50, "Créer mon pendentif", "primary")
        return cur + h
    return interior(p, "jewel-memories.fr/comment-ca-marche", "Le processus", "Comment ça marche",
                    "Créer un bijou gravé n’a jamais été aussi simple. Tout se passe en ligne, en quelques minutes.",
                    body, "Comment ça marche", 4)

# ---------- 7. QUALITE ----------
def qualite(p):
    def body(p, cur):
        h = 700
        band(p, cur, h, PAPER)
        y = cur + 54
        cards = [
            ("Gravure laser de précision", "Chaque gravure est réalisée au laser pour un trait net, durable et fidèle à votre aperçu, jusque dans les plus fins détails."),
            ("Des matériaux nobles", "Argent massif 925, acier inoxydable plaqué or, ou or 18 carats : des matières choisies pour traverser le temps."),
            ("Contrôle à l’unité", "Chaque pièce est inspectée à la main avant l’expédition. Aucune ne part sans avoir été vérifiée."),
            ("Fabrication responsable", "Production à la commande, sans surstock, et emballages soignés en matériaux recyclables."),
        ]
        cw = (W - 2*MARGIN - 30) / 2
        ch = 150
        for i, (t, b) in enumerate(cards):
            x = MARGIN + (i % 2)*(cw+30)
            yy = y + (i//2)*(ch+26)
            p.rect(x, yy, cw, ch, fill=CREAM, stroke=LINE, sw=1, radius=14)
            p.circle(x+44, yy+46, 16, stroke=GOLD, sw=1.4)
            diamond(p, x+44, yy+46, 5, GOLD)
            p.text(x+78, yy+42, t, "Serif", 20, INK)
            paragraph(p, x+78, yy+66, b, "Sans", 12.5, INK_SOFT, cw-110, 19)
        y += 2*ch + 26 + 56
        # quote band
        p.rect(MARGIN, y, W-2*MARGIN, 130, fill=INK, radius=16)
        p.text(W/2, y+62, "« Un bijou n’a de valeur que par l’histoire qu’il porte. »",
               "SerifIt", 26, CREAM, align='c')
        p.text(W/2, y+96, "— L’atelier Jewel Memories", "Sans", 12, GOLD_SF, align='c', tracking=1)
        return cur + h
    return interior(p, "jewel-memories.fr/qualite", "Notre savoir-faire", "Une qualité qui se transmet",
                    "Parce qu’un bijou-souvenir doit durer toute une vie, nous ne transigeons sur rien.",
                    body, "Qualité", 5)

# ---------- 8. FAQ ----------
def faq(p):
    def body(p, cur):
        qs = [
            ("Quels sont les délais de fabrication et de livraison ?",
             "Chaque pièce est gravée à la commande dans notre atelier. Comptez 7 à 10 jours ouvrés entre la validation de votre commande et la réception, écrin et livraison soignée compris."),
            ("Quelles gravures puis-je choisir ?", None),
            ("Comment fonctionne la conversion de ma photo ?", None),
            ("Quels matériaux proposez-vous ?", None),
            ("Comment entretenir mon bijou gravé ?", None),
            ("La chaîne est-elle incluse ?", None),
            ("Puis-je retourner ma commande personnalisée ?", None),
        ]
        # hauteur dynamique
        rows = []
        y = cur + 50
        total_top = y
        for i, (q, a) in enumerate(qs):
            rows.append((y, q, a))
            rh = 64
            if a:
                rh = 64 + len(wrap(a, "Sans", 13, W-2*MARGIN-90)) * 21 + 16
            y += rh
        h = (y - cur) + 60
        band(p, cur, h, PAPER)
        for (yy, q, a) in rows:
            p.text(MARGIN, yy+34, q, "Serif", 19, INK)
            sign = "–" if a else "+"
            p.circle(W-MARGIN-16, yy+28, 14, stroke=LINE_DK, sw=1.2)
            p.text(W-MARGIN-16, yy+33, sign, "Sans", 16, GOLD_DK, align='c')
            ny = yy + 56
            if a:
                ny = paragraph(p, MARGIN, yy+58, a, "Sans", 13, INK_SOFT, W-2*MARGIN-90, 21) + 8
            p.line(MARGIN, (ny if a else yy+56), W-MARGIN, (ny if a else yy+56), LINE, 1)
        return cur + h
    return interior(p, "jewel-memories.fr/faq", "Questions fréquentes", "On répond à tout",
                    "Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons rapidement.",
                    body, "FAQ", 6)

# ---------- 9. PAIEMENT & CONFIRMATION ----------
def paiement(p):
    def body(p, cur):
        h = 640
        band(p, cur, h, PAPER)
        gap = 40
        leftw = (W - 2*MARGIN - gap) * 0.54
        rightw = (W - 2*MARGIN - gap) - leftw
        lx, rx = MARGIN, MARGIN + leftw + gap
        top = cur + 48
        # LEFT : récapitulatif
        p.rect(lx, top, leftw, 360, fill=CREAM, stroke=LINE, sw=1, radius=16)
        eyebrow(p, lx+28, top+34, "Récapitulatif")
        draw_shape(p, lx+84, top+128, "heart", 96)
        p.text(lx+170, top+92, "Pendentif Cœur", "Serif", 22, INK)
        p.text(lx+170, top+116, "Gravure : photo en line art", "Sans", 12, INK_SOFT)
        rows = [("Support — Cœur (17 mm)", "62 €"), ("Matière — Argent 925", "Inclus"),
                ("Gravure — line art", "Inclus"), ("Écrin & livraison", "Offert")]
        ry = top+186
        for label, val in rows:
            p.text(lx+28, ry, label, "Sans", 12.5, INK_SOFT)
            p.text(lx+leftw-28, ry, val, "Sans", 12.5, INK, align='r')
            ry += 30
        p.line(lx+28, ry-2, lx+leftw-28, ry-2, LINE, 1)
        p.text(lx+28, ry+30, "Total", "Serif", 20, INK)
        price(p, lx+leftw-28, ry+32, "62 €", 26, GOLD_DK, align='r')
        # RIGHT : coordonnées & paiement
        p.rect(rx, top, rightw, 360, fill=CREAM, stroke=LINE, sw=1, radius=16)
        eyebrow(p, rx+28, top+34, "Coordonnées & paiement")
        p.text(rx+28, top+72, "Adresse email", "Sans", 11.5, INK_SOFT)
        p.rect(rx+28, top+84, rightw-56, 44, fill=WHITE, stroke=LINE_DK, sw=1, radius=8)
        p.text(rx+42, top+111, "vous@email.com", "Sans", 12.5, HexColor("#A89F8E"))
        # google button
        p.rect(rx+28, top+142, rightw-56, 44, fill=WHITE, stroke=LINE_DK, sw=1, radius=8)
        p.circle(rx+52, top+164, 8, stroke=GOLD, sw=1.4)
        p.text(rx+52, top+169, "G", "SansB", 11, GOLD_DK, align='c')
        p.text(rx+rightw/2+8, top+169, "Continuer avec Google", "Sans", 12.5, INK, align='c')
        # divider
        p.line(rx+28, top+210, rx+rightw/2-22, top+210, LINE, 1)
        p.text(rx+rightw/2, top+214, "ou", "Sans", 11, INK_SOFT, align='c')
        p.line(rx+rightw/2+22, top+210, rx+rightw-28, top+210, LINE, 1)
        pill_button(p, rx+28, top+232, rightw-56, 50, "Procéder au paiement — Stripe", "gold")
        p.circle(rx+rightw/2-92, top+304, 6, stroke=GOLD_DK, sw=1.2)
        p.text(rx+rightw/2+4, top+308, "Paiement 100% sécurisé via Stripe", "Sans", 11, INK_SOFT, align='c')
        # SUCCESS banner
        sy = top + 392
        p.rect(MARGIN, sy, W-2*MARGIN, 88, fill=SAND, stroke=GOLD_SF, sw=1, radius=14)
        p.circle(MARGIN+52, sy+44, 19, fill=GOLD, )
        def chk(c):
            c.setStrokeColor(WHITE); c.setLineWidth(2.4); c.setLineCap(1)
            path=c.beginPath(); path.moveTo(MARGIN+44, sy+44); path.lineTo(MARGIN+50, sy+50); path.lineTo(MARGIN+61, sy+37)
            c.drawPath(path, stroke=1, fill=0)
        p.ops.append(chk)
        p.text(MARGIN+92, sy+40, "Merci ! Votre paiement a bien été reçu.", "Serif", 19, INK)
        p.text(MARGIN+92, sy+62, "Nous lançons la fabrication et vous tenons informé par email à chaque étape.", "Sans", 12, INK_SOFT)
        p.text(W-MARGIN-24, sy+50, "/paiement/succes", "Sans", 11, GOLD_DK, align='r')
        return cur + h
    return interior(p, "jewel-memories.fr/paiement", "Dernière étape", "Finaliser votre commande",
                    "Vérifiez votre pendentif, renseignez votre email, puis réglez en paiement sécurisé.",
                    body, "Paiement", 7)

# =====================================================================
PAGES = [cover, design_system, homepage, modeles, configurateur,
         comment_ca_marche, qualite, faq, paiement]

c = canvas.Canvas("/home/user/Jewel-memories/design/Jewel-Memories-Mockups.pdf", pagesize=(W, 900))
for b in PAGES:
    render(c, b)
c.save()
print("OK", len(PAGES), "pages")
