class Pool {
    constructor() {
        this.p = new Map();

        this.cbs = [];
    }

    has(key) {
        return this.p.has(key);
    }

    get(key) {
        return this.p.get(key);
    }

    set(key, value) {
        this.p.set(key, value);
    }

    delete(key) {
        this.p.delete(key);
    }

    forEach(cb) {
        this.p.forEach((value, key, map) => cb(value, key, map));
    }

    addUpdateCb(cb) {
        this.cbs.push(cb);
    }

    update() {
        this.p.forEach((value, key, map) => {
            this.cbs.forEach(cb => {
                cb(value, key, map);
            });
        });
    }
}

function updateObject(object, key, map) {
    if (!object.isActive) return;
    object.update();
    buffer.add(object.positionInt.x, object.positionInt.y, object.shape);
}

function enemyCheckCollision(enemy) {
    if (!enemy.isActive) return;

    bulletPool.forEach((bullet) => { // for this enemy, loop through every bullet and check any collisions / overlaps
        let collideInfo = enemy.isCollided(bullet);
        if (!collideInfo.isCollided) return;
        enemy.delete();
        bullet.delete();
        // add explosion
        let explosion = new Explosion(collideInfo.position.x, collideInfo.position.y, bullet.color);
        explosionPool.set(explosion.id, explosion);
        window.GAME_SCORE += 100;
    })

    missilePool.forEach((missile) => { // for this enemy, loop through every missile and check any collisions / overlaps
        let collideInfo = enemy.isCollided(missile);
        if (!collideInfo.isCollided) return;
        enemy.delete();
        missile.delete();
        // add explosion
        let explosion = new Explosion(collideInfo.position.x, collideInfo.position.y, 'orange');
        explosionPool.set(explosion.id, explosion);
        window.GAME_SCORE += 150;
    })

    mainPool.forEach((object) => { // for this enemy, check if it hit my plane
        if (object.type !== 'plane') return;
        let plane = object;
        let collideInfo = enemy.isCollided(plane);
        if (!collideInfo.isCollided) return;
        enemy.delete();
        // add explosion
        let explosion = new Explosion(collideInfo.position.x, collideInfo.position.y, 'cyan');
        plane.wounded();
        explosionPool.set(explosion.id, explosion);
        window.GAME_HP -= 1;
    })
}

function missileFindTarget(missile) {
    if (!missile.isActive) return;
    enemyPool.forEach((enemy) => {
        if (missile.target === null && enemy.targetMissile === null) {
            missile.aim(enemy);
        }
    })
}