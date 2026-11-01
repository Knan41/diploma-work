require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
require("./db");

const app = express();
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

// Şəkillər public/images qovluğundan verilir
app.use(
  "/images",
  express.static(path.join(__dirname, "..", "public", "images")),
);

// Cavablardakı "/images/..." yollarını tam ünvana çevirir (frontend birbaşa <img src> işlədə bilsin)
function absolutize(v, base) {
  if (Array.isArray(v)) return v.map((x) => absolutize(x, base));
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v)) {
      o[k] =
        k === "image" && typeof v[k] === "string" && v[k].startsWith("/images/")
          ? base + v[k]
          : absolutize(v[k], base);
    }
    return o;
  }
  return v;
}
app.use((req, res, next) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const json = res.json.bind(res);
  res.json = (body) => json(absolutize(body, base));
  next();
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/users", require("./routes/users"));
app.use("/api/stats", require("./routes/stats"));

app.use((req, res) =>
  res.status(404).json({ message: "Səhifə tapılmadı" }),
);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server xətası" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server işləyir: http://localhost:${PORT}`));
