import type { CafeRoom as Room } from "@/data/cafe-rooms";

/**
 * The café photograph behind a food sequence.
 *
 * Decorative — the dish and the copy carry the meaning — so it is hidden from
 * assistive technology. All of the treatment (blur, overscale, knock-down) is
 * in `.cafe-room` and the owning section's own rules in `globals.css`, so the
 * burger's room and the pizza's room can be graded separately without this
 * component knowing which is which.
 */
export function CafeRoom({ room }: { room: Room }) {
  return (
    <div
      className="cafe-room"
      aria-hidden="true"
      style={
        {
          "--room-focus": room.focus.desktop,
          "--room-focus-mobile": room.focus.mobile,
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={room.src}
        alt=""
        width={room.width}
        height={room.height}
        className="select-none"
        draggable={false}
      />
    </div>
  );
}
