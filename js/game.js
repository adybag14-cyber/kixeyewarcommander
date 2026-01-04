import { AssetLoader } from './assets.js';
import { Renderer } from './renderer.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.assets = new AssetLoader();
        this.renderer = null;
        this.lastTime = 0;

        // Game State
        this.camera = { x: 0, y: 0 };
        this.input = {
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            lastMouseX: 0,
            lastMouseY: 0
        };

        this.entities = [
            { type: 'building', id: 'cc1', x: 0, y: 0, asset: 'cc' },
            { type: 'unit', id: 'tank1', x: 2, y: 2, asset: 'tank' }
        ];

        this.selectedEntity = null;
        this.buildMode = { active: false, x: 0, y: 0, asset: null };

        this.init();
    }

    async init() {
        await this.assets.loadAll();
        document.getElementById('loading').style.display = 'none';

        this.renderer = new Renderer(this.canvas, this.assets);
        this.setupUI();
        this.setupInput();

        requestAnimationFrame(t => this.loop(t));
    }

    setupUI() {
        const cards = document.querySelectorAll('.build-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const label = card.querySelector('.build-label').innerText;
                this.enterBuildMode(label);
            });
        });
    }

    enterBuildMode(type) {
        let assetName = '';
        if (type === 'Defense') assetName = 'cc';
        if (type === 'Sentinel') assetName = 'sentinel_cc';
        if (type === 'Resource') assetName = 'oil';
        if (type === 'Units') {
            console.log("Unit production not implemented yet");
            return;
        }

        // Slight delay to avoid click propagation
        setTimeout(() => {
            this.buildMode = {
                active: true,
                asset: assetName,
                type: 'building',
                x: 0,
                y: 0
            };
            this.selectedEntity = null; // Deselect
        }, 50);
    }

    setupInput() {
        this.canvas.addEventListener('mousedown', e => {
            if (e.button === 2) { // Right Click
                if (this.buildMode.active) {
                    this.buildMode.active = false;
                    return;
                }
                this.handleRightClick(e.clientX, e.clientY);
                return;
            }
            // Left Click
            if (this.buildMode.active) {
                this.placeBuilding();
                return;
            }

            this.input.isDragging = true;
            this.input.dragStartX = e.clientX;
            this.input.dragStartY = e.clientY;
            this.input.lastMouseX = e.clientX;
            this.input.lastMouseY = e.clientY;
        });

        window.addEventListener('mouseup', e => {
            this.input.isDragging = false;
            // Check for click (if didn't drag much) and NOT in build mode
            if (!this.buildMode.active && Math.abs(e.clientX - this.input.dragStartX) < 5 && Math.abs(e.clientY - this.input.dragStartY) < 5) {
                this.handleClick(e.clientX, e.clientY);
            }
        });

        window.addEventListener('mousemove', e => {
            // Update Ghost Position
            if (this.buildMode.active) {
                const gridPos = this.renderer.screenToIso(e.clientX, e.clientY, this.camera);
                this.buildMode.x = gridPos.x;
                this.buildMode.y = gridPos.y;
            }

            if (this.input.isDragging) {
                const dx = e.clientX - this.input.lastMouseX;
                const dy = e.clientY - this.input.lastMouseY;

                this.camera.x -= dx;
                this.camera.y -= dy;

                this.input.lastMouseX = e.clientX;
                this.input.lastMouseY = e.clientY;
            }
        });

        // Prevent context menu on right click
        window.addEventListener('contextmenu', e => e.preventDefault());
    }

    placeBuilding() {
        if (!this.buildMode.active) return;

        // Check if spot is occupied
        const isOccupied = this.entities.some(e => Math.round(e.x) === this.buildMode.x && Math.round(e.y) === this.buildMode.y);

        if (!isOccupied) {
            this.entities.push({
                type: 'building',
                id: 'bld_' + Date.now(),
                x: this.buildMode.x,
                y: this.buildMode.y,
                asset: this.buildMode.asset
            });
            // Stay in build mode
        }
    }

    handleClick(sx, sy) {
        const gridPos = this.renderer.screenToIso(sx, sy, this.camera);
        // Find entity at this position (simple hit box)
        const clickedEntity = this.entities.find(e => Math.round(e.x) === gridPos.x && Math.round(e.y) === gridPos.y);

        if (clickedEntity) {
            this.selectedEntity = clickedEntity;
        } else {
            this.selectedEntity = null;
        }
    }

    handleRightClick(sx, sy) {
        if (this.selectedEntity && this.selectedEntity.type === 'unit') {
            const gridPos = this.renderer.screenToIso(sx, sy, this.camera);
            this.moveUnit(this.selectedEntity, gridPos.x, gridPos.y);
        }
    }

    moveUnit(unit, targetX, targetY) {
        unit.targetX = targetX;
        unit.targetY = targetY;
        unit.isMoving = true;
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        // Unit Movement Logic
        this.entities.forEach(ent => {
            if (ent.isMoving) {
                const speed = 0.005 * dt; // Movement speed
                const dx = ent.targetX - ent.x;
                const dy = ent.targetY - ent.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < speed) {
                    ent.x = ent.targetX;
                    ent.y = ent.targetY;
                    ent.isMoving = false;
                } else {
                    ent.x += (dx / dist) * speed;
                    ent.y += (dy / dist) * speed;
                }
            }
        });
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawWorld(this.entities, this.camera, this.selectedEntity, this.buildMode);
    }
}

window.onload = () => {
    new Game();
};
