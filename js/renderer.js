export class Renderer {
    constructor(canvas, assets) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.assets = assets;

        // Isometric Tile Size (Typical for these games: 2:1 ratio)
        // Adjusting based on 'terrain.png' inspection. 
        // Assuming a standard grid cell is around 60-100 pixels in width.
        this.TILE_WIDTH = 100;
        this.TILE_HEIGHT = 50;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    clear() {
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Convert Grid (x,y) to Screen (x,y)
    isoToScreen(gx, gy, camera) {
        const screenX = (gx - gy) * this.TILE_WIDTH * 0.5 - camera.x + this.width / 2;
        const screenY = (gx + gy) * this.TILE_HEIGHT * 0.5 - camera.y + this.height / 2;
        return { x: screenX, y: screenY };
    }

    drawWorld(entities, camera, selection, ghost) {
        // 1. Draw Infinite Terrain
        // We use the terrain.png to tile the ground.
        // For performance, we only draw tiles within the view + margin.

        const terrainImg = this.assets.get('terrain');
        const mapSize = 50; // 50x50 grid

        // Simple culling could be added here, but for 50x50 iterating is usually fine on modern PC.
        for (let x = -mapSize; x <= mapSize; x++) {
            for (let y = -mapSize; y <= mapSize; y++) {
                // Optimization: Simple view culling
                const pos = this.isoToScreen(x, y, camera);
                if (pos.x < -this.TILE_WIDTH || pos.x > this.width + this.TILE_WIDTH ||
                    pos.y < -this.TILE_HEIGHT || pos.y > this.height + this.TILE_HEIGHT) {
                    continue;
                }

                // Draw Ground Tile
                // Randomized terrain selection based on position hash
                // We downloaded many terrainXX.png files.
                // Let's use a hash to pick one stability.
                let tIndex = Math.abs((x * 73856093) ^ (y * 19349663)) % 100;
                // We know we have terrain10...terrain155 but loosely.
                // Let's try to fetch specific common ones if we can't guess.
                // Actually, let's just use 'terrain12', 'terrain45', 'terrain67' as primary variations if they exist.

                // Simple Variation Logic:
                let variant = 'terrain'; // Default
                const v = Math.abs(x + y) % 5;
                if (v === 0) variant = 'terrain12';
                if (v === 1) variant = 'terrain45';
                if (v === 2) variant = 'terrain67';
                if (v === 3) variant = 'terrain115';
                if (v === 4) variant = 'terrain22';

                let tileImg = this.assets.get(variant);
                if (!tileImg) tileImg = this.assets.get('terrain'); // Fallback

                if (tileImg) {
                    this.ctx.drawImage(tileImg, pos.x - this.TILE_WIDTH / 2, pos.y - this.TILE_HEIGHT / 2, this.TILE_WIDTH, this.TILE_HEIGHT);
                } else {
                    this.drawIsoTile(pos.x, pos.y, '#222', '#333');
                }

                // Draw Grid overlay
                this.drawIsoGridOutline(pos.x, pos.y, 'rgba(255, 255, 255, 0.05)');
            }
        }

        // 2. Sort Entities by Depth
        entities.sort((a, b) => (a.x + a.y) - (b.x + b.y));

        // 3. Draw Entities & Selection
        entities.forEach(ent => {
            const pos = this.isoToScreen(ent.x, ent.y, camera);

            // Draw Selection Circle
            if (selection && selection.id === ent.id) {
                this.drawSelectionCircle(pos.x, pos.y, '#00ff00');
            }

            const sprite = this.assets.get(ent.asset);
            if (sprite) {
                const drawX = pos.x - sprite.width / 2;
                const drawY = pos.y - sprite.height + (this.TILE_HEIGHT / 4);
                this.ctx.drawImage(sprite, drawX, drawY);
            }
        });

        // 4. Draw Ghost (if enabled)
        if (ghost && ghost.active) {
            const pos = this.isoToScreen(ghost.x, ghost.y, camera);

            // Draw Grid indicator under ghost
            this.drawIsoTile(pos.x, pos.y, 'rgba(0, 255, 0, 0.3)', '#00ff00');

            const sprite = this.assets.get(ghost.asset);
            if (sprite) {
                this.ctx.save();
                this.ctx.globalAlpha = 0.6; // Transparent
                const drawX = pos.x - sprite.width / 2;
                const drawY = pos.y - sprite.height + (this.TILE_HEIGHT / 4);
                this.ctx.drawImage(sprite, drawX, drawY);
                this.ctx.restore();
            }
        }
    }

    // Convert Screen (x,y) to Grid (x,y)
    screenToIso(sx, sy, camera) {
        const adjX = sx + camera.x - this.width / 2;
        const adjY = sy + camera.y - this.height / 2;

        const gy = (adjY / (this.TILE_HEIGHT * 0.5) - adjX / (this.TILE_WIDTH * 0.5)) / 2;
        const gx = (adjY / (this.TILE_HEIGHT * 0.5) + adjX / (this.TILE_WIDTH * 0.5)) / 2;

        return { x: Math.round(gx), y: Math.round(gy) };
    }

    drawIsoTile(x, y, color, border) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - this.TILE_HEIGHT / 2); // Top
        this.ctx.lineTo(x + this.TILE_WIDTH / 2, y); // Right
        this.ctx.lineTo(x, y + this.TILE_HEIGHT / 2); // Bottom
        this.ctx.lineTo(x - this.TILE_WIDTH / 2, y); // Left
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = border;
        this.ctx.stroke();
    }

    drawIsoGridOutline(x, y, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - this.TILE_HEIGHT / 2);
        this.ctx.lineTo(x + this.TILE_WIDTH / 2, y);
        this.ctx.lineTo(x, y + this.TILE_HEIGHT / 2);
        this.ctx.lineTo(x - this.TILE_WIDTH / 2, y);
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    drawSelectionCircle(x, y, color) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, this.TILE_WIDTH / 2, this.TILE_HEIGHT / 2, 0, 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = color;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.lineWidth = 1;
    }
}
