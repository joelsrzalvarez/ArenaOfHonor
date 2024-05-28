import Sprite from './Sprite.js';

const gravity = 1;

class Fighter extends Sprite {
    constructor({ name, position, offset, imageSrc, scale, maxFrames, holdFrames, offsetFrame = { x: 0, y: 0 }, sprites, keys, attackTime }) {
        super({ position, imageSrc, scale, maxFrames, holdFrames, offsetFrame });
        this.name = name;
        this.height = 150;
        this.width = 50;
        this.velocity = { x: 0, y: 0 }; 
        this.moveFactor = 6;    
        this.lastKey;           
        this.inTheAir = false;  
        this.isAttacking = false;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: offset, 
            width: 150,
            height: 150
        };  
        this.sprites = sprites;
        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }
        this.keys = keys;
        this.attackTime = attackTime;
        this.attackCooldown = true;
        this.isTakingHit = false; 
        this.state = 'idle'; 
        this.isDead = false;
    }

    update(context) {
        super.update(context);
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;    
        this.attackBox.position.y = this.position.y;    

        if (this.inTheAir) {
            this.velocity.x = 0; 
        }

        this.position.y += this.velocity.y;     
        this.position.x += this.velocity.x;    

        if (this.position.y + this.height + this.velocity.y >= window.innerHeight - 50) {
            this.velocity.y = 0;
            this.inTheAir = false;
            this.position.y = window.innerHeight - this.height - 50; 
            if (!this.isAttacking && !this.isTakingHit) {
                this.switchSprite('idle'); 
            }
        } else {    
            this.velocity.y += gravity; 
            if (this.velocity.y > 0) {  
                this.switchSprite('fall');
            } else {    
                this.inTheAir = true;   
                this.switchSprite('jump');
            }
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites[sprite].image) return;
        this.image = this.sprites[sprite].image;
        this.maxFrames = this.sprites[sprite].maxFrames;
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        //console.log(`Switching to ${sprite} sprite`);
    }
    
    handleAction(action) {
        if (this.isAttacking && action !== 'attack') return;
        if (this.isDead && action !== 'die') return;
    
        switch (action) {
            case 'move':
                if (!this.inTheAir) {
                    this.switchSprite('run');
                }
                break;
            case 'jump':
                if (!this.inTheAir) {
                    this.velocity.y = -20;
                    this.inTheAir = true;
                    this.switchSprite('jump');
                }
                break;
            case 'attack':
                if (this.attackCooldown) {
                    this.switchSprite('attack1');
                    this.isAttacking = true;
                    this.attackCooldown = false;
                    setTimeout(() => {
                        this.isAttacking = false;
                        this.attackCooldown = true;
                        if (!this.isDead) {
                            if (this.inTheAir) {
                                this.switchSprite('jump');
                            } else {
                                this.switchSprite('idle');
                            }
                        }
                    }, this.attackTime);
                }
                break;
            case 'hit':
                if (!this.isDead) {
                    this.switchSprite('takeHit');
                    this.isTakingHit = true;
                    setTimeout(() => {
                        this.isTakingHit = false;
                        if (!this.isDead) {
                            if (this.inTheAir) {
                                this.switchSprite('jump');
                            } else {
                                this.switchSprite('idle');
                            }
                        }
                    }, 300);
                }
                break;
            case 'die':
                this.isDead = true;
                this.switchSprite('death');
                break;
            case 'idle':
                if (!this.isDead && !this.inTheAir) {
                    this.switchSprite('idle');
                }
                break;
        }
    }
    
    update(context) {
        super.update(context);
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;
        this.attackBox.position.y = this.position.y;
    
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    
        if (this.position.y + this.height + this.velocity.y >= window.innerHeight - 50) {
            this.velocity.y = 0;
            this.inTheAir = false;
            this.position.y = window.innerHeight - this.height - 50;
            if (!this.isAttacking && !this.isTakingHit) {
                this.switchSprite('idle');
            }
        } else {
            this.velocity.y += gravity;
            if (this.velocity.y > 0) {
                if (!this.isAttacking && !this.isTakingHit) {
                    this.switchSprite('fall');
                }
            } else {
                this.inTheAir = true;
                if (!this.isAttacking && !this.isTakingHit) {
                    this.switchSprite('jump');
                }
            }
        }
    }    

    isHitting(enemyFighter) {
        return (
            this.attackBox.position.x + this.attackBox.width >= enemyFighter.position.x &&
            this.attackBox.position.x <= enemyFighter.position.x + enemyFighter.width &&
            this.attackBox.position.y + this.attackBox.height >= enemyFighter.position.y &&
            this.attackBox.position.y <= enemyFighter.position.y + enemyFighter.height
        );
    }
}

export default Fighter;