class MachineGun {
    constructor(x, y, parent, type = 'Machine Gun') {
        this.type = type;
        this.parent = parent;
        this.offset = new Vector2(x, y);
        this.active = true;
    }

    attack() {
        let bpx = this.parent.position.x + this.offset.x;
        let bpy = this.parent.position.y + this.offset.y;
        let b = new Bullet(bpx, bpy);
        bulletPool.set(b.id, b);
    }
}