import {
  X,
  MapPin,
  Clock,
  Heart,
  Navigation,
  Utensils,
  Car,
  Check
} from "lucide-react";

import { openGoogleMaps } from "../../utils/googleMaps";

import "./RestaurantDetail.css";

export default function RestaurantDetail({
  restaurant,
  isFavorite,
  onToggleFavorite,
  onClose
}) {
  if (!restaurant) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <header className="detail-header">
          <span className="eyebrow">RESTAURANT DETAILS</span>

          <button
            type="button"
            className="icon-button"
            aria-label="ปิดรายละเอียด"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>

        <div className="detail-identity">
          <span className="detail-identity-icon" aria-hidden="true">
            <Utensils size={30} />
          </span>
          <div>
            <span className="detail-category">{restaurant.cuisine}</span>
            <strong>{restaurant.priceLevel || "ราคาไม่ระบุ"}</strong>
          </div>
        </div>

        <div className="detail-body">
          {restaurant.verified && (
            <span className="badge badge-certified">
              <Check size={14} strokeWidth={3} />
              ยืนยันแล้ว
            </span>
          )}

          <h2 id="detail-title">{restaurant.name}</h2>

          <p className="detail-description">
            {restaurant.description}
          </p>

          <div className="detail-info-row">
            <MapPin size={18} />
            <span>
              {restaurant.address || restaurant.district} ·{" "}
              {restaurant.zone === "MFU"
                ? "บริเวณมหาวิทยาลัยแม่ฟ้าหลวง"
                : restaurant.zone === "CITY"
                  ? "เขตตัวเมือง"
                  : restaurant.zone === "MAESAI"
                    ? "เขตแม่สาย"
                    : "เชียงราย"}
            </span>
          </div>

          <div className="detail-info-row">
            <Clock size={18} />
            <span>{restaurant.openingHours}</span>
          </div>

          <div className="detail-section">
            <h3>เมนูและราคา</h3>

            {restaurant.menu?.length ? (
              <ul className="menu-list">
                {restaurant.menu.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    <span>{item.name}</span>
                    <strong>
                      {item.price != null
                        ? `฿${item.price}`
                        : "ไม่ระบุราคา"}
                    </strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-text">
                ยังไม่มีข้อมูลเมนู
              </p>
            )}
          </div>

          <div className="detail-section">
            <h3>สิ่งอำนวยความสะดวก</h3>

            <div className="amenity-list">
              {restaurant.amenities?.length ? (
                restaurant.amenities.map((amenity) => (
                  <span className="amenity-chip" key={amenity}>
                    {amenity}
                  </span>
                ))
              ) : (
                <span className="muted-text">
                  ยังไม่มีข้อมูลสิ่งอำนวยความสะดวก
                </span>
              )}
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="button-secondary"
              onClick={() => onToggleFavorite(restaurant.id)}
            >
              <Heart
                size={19}
                fill={isFavorite ? "currentColor" : "none"}
              />
              {isFavorite ? "บันทึกแล้ว" : "บันทึกร้าน"}
            </button>

            <button
              type="button"
              className="button-primary"
              onClick={() => openGoogleMaps(restaurant)}
            >
              <Navigation size={19} />
              นำทาง
            </button>
          </div>

          <p className="detail-footnote">
            <Car size={14} />
            กดนำทางเพื่อค้นหาร้านใน Google Maps
          </p>
        </div>
      </section>
    </div>
  );
}