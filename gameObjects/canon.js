class Canon extends MachineGun {
    constructor(x, y, parent, type = 'Canon') {
        super(x, y, parent, type);

        this.fireTargetIndex = 10;
        this.fireIndex = 0; // canon requires a slower fire rate, so when this.fireIndex >= this.fireTargetIndex, fire a canon
    }

    attack() {
        this.fireIndex++;
        if (this.fireIndex < this.fireTargetIndex) return;

        let bpx = this.parent.position.x + this.offset.x;
        let bpy = this.parent.position.y + this.offset.y;
        let b = new BulletBig(bpx, bpy);
        bulletPool.set(b.id, b);

        this.fireIndex = 0;
    }
}