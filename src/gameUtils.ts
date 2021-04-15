import { GameObject } from 'kontra';

export function circleCollision(circle: GameObject, other: GameObject) {
  const dx = circle.world.x - other.x;
  const dy = circle.world.y - other.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < circle.radius + other.radius;
}

export function rectCollision(rect: GameObject, other: GameObject) {
  return (
    rect.x < other.x + other.width &&
    rect.x + rect.width > other.x &&
    rect.y < other.y + other.height &&
    rect.y + rect.height > other.y
  );
}
