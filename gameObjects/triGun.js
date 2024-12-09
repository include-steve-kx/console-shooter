class TriGun extends MachineGun {
    constructor(x, y, parent, type = 'Tri Gun') {
        super(x, y, parent, type);
    }

    attack() {
        let bpx = this.parent.position.x + this.offset.x;
        let bpy = this.parent.position.y + this.offset.y;
        let b1 = new Bullet(bpx, bpy, 0);
        bulletPool.set(b1.id, b1);
        let b2 = new Bullet(bpx - 1, bpy, 315);
        bulletPool.set(b2.id, b2);
        let b3 = new Bullet(bpx + 1, bpy, 45);
        bulletPool.set(b3.id, b3);
    }
}