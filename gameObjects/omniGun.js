class OmniGun extends MachineGun {
    constructor(x, y, parent, type = 'Omni Gun') {
        super(x, y, parent, type);
    }

    attack() {
        for (let i = 0; i < 8; i++) {
            let bpx = this.parent.position.x + this.offset.x;
            let bpy = this.parent.position.y + this.offset.y;
            let angle = i * 45;
            let bullet = new Bullet(bpx, bpy, angle);
            bulletPool.set(bullet.id, bullet);
        }
    }
}