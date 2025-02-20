class AnimatedInput {
    constructor(container) {
        this.container = container;
        this.animations = [
            {
                text: "this shape can morph into different forms...",
                duration: 2000,
                action: 'morph'
            },
            {
                text: "it can smoothly change colors...",
                duration: 2000,
                action: 'color'
            },
            {
                text: "rotate in 3D space...",
                duration: 2000,
                action: 'rotate'
            },
            {
                text: "and create beautiful patterns...",
                duration: 2500,
                action: 'pattern'
            }
        ];
        this.init();
    }

    init() {
        this.createElements();
        this.startAnimationSequence();
    }

    createElements() {
        this.inputContainer = document.createElement('div');
        this.inputContainer.className = 'animated-input-container';
        
        this.input = document.createElement('div');
        this.input.className = 'animated-input';
        this.input.innerHTML = `
            <div class="input-content">
                <span class="input-text"></span>
                <span class="cursor">|</span>
            </div>
        `;
        
        this.canvas = document.createElement('div');
        this.canvas.className = 'animation-canvas';
        this.canvas.innerHTML = `
            <svg viewBox="0 0 400 300" class="animation-svg" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#FF6B6B"/>
                        <stop offset="100%" style="stop-color:#4ECDC4"/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#A8E6CF"/>
                        <stop offset="100%" style="stop-color:#FFD3B6"/>
                    </linearGradient>
                </defs>
                <g class="shape-container" transform="translate(200, 150)">
                    <!-- Base shape -->
                    <path class="morph-shape" 
                          d="M-50,-50 L50,-50 L50,50 L-50,50 Z" 
                          fill="#FF6B6B"
                          transform="rotate(0)"/>
                    
                    <!-- Pattern shapes -->
                    <g class="pattern-group" opacity="0">
                        <circle cx="-30" cy="-30" r="10" fill="#FFD3B6"/>
                        <circle cx="30" cy="-30" r="10" fill="#A8E6CF"/>
                        <circle cx="30" cy="30" r="10" fill="#FFD3B6"/>
                        <circle cx="-30" cy="30" r="10" fill="#A8E6CF"/>
                    </g>
                </g>
            </svg>
        `;

        this.inputContainer.appendChild(this.input);
        this.inputContainer.appendChild(this.canvas);
        this.container.appendChild(this.inputContainer);
    }

    async typeText(text) {
        const textElement = this.input.querySelector('.input-text');
        textElement.textContent = '';
        
        for (let char of text) {
            textElement.textContent += char;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async startAnimationSequence() {
        while (true) {
            for (let i = 0; i < this.animations.length; i++) {
                const animation = this.animations[i];
                
                await this.typeText(animation.text);
                await new Promise(resolve => setTimeout(resolve, 300));
                
                switch(animation.action) {
                    case 'morph':
                        await this.morphShape();
                        break;
                    case 'color':
                        await this.changeColor();
                        break;
                    case 'rotate':
                        await this.rotateShape();
                        break;
                    case 'pattern':
                        await this.showPattern();
                        break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            this.resetComponent();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    async morphShape() {
        const shape = this.canvas.querySelector('.morph-shape');
        
        return new Promise(resolve => {
            anime({
                targets: shape,
                d: [
                    { value: 'M-50,-50 L50,-50 L50,50 L-50,50 Z' },
                    { value: 'M0,-50 L50,0 L0,50 L-50,0 Z' },
                    { value: 'M-50,-50 L50,-50 L50,50 L-50,50 Z' }
                ],
                duration: 2000,
                easing: 'easeInOutQuad',
                complete: resolve
            });
        });
    }

    async changeColor() {
        const shape = this.canvas.querySelector('.morph-shape');
        
        return new Promise(resolve => {
            anime({
                targets: shape,
                fill: ['#FF6B6B', 'url(#gradient1)', 'url(#gradient2)'],
                duration: 2000,
                easing: 'easeInOutQuad',
                complete: resolve
            });
        });
    }

    async rotateShape() {
        const shape = this.canvas.querySelector('.morph-shape');
        
        return new Promise(resolve => {
            anime({
                targets: shape,
                transform: [
                    'rotate(0) scale(1)',
                    'rotate(360) scale(1.1)',
                    'rotate(720) scale(1)'
                ],
                duration: 2000,
                easing: 'easeInOutQuad',
                complete: resolve
            });
        });
    }

    async showPattern() {
        const patternGroup = this.canvas.querySelector('.pattern-group');
        const shape = this.canvas.querySelector('.morph-shape');
        
        return new Promise(resolve => {
            anime.timeline({
                easing: 'easeInOutQuad',
                complete: resolve
            })
            .add({
                targets: shape,
                opacity: [1, 0.3],
                duration: 1000
            })
            .add({
                targets: patternGroup,
                opacity: [0, 1],
                duration: 1000,
                complete: () => {
                    anime({
                        targets: '.pattern-group circle',
                        scale: [1, 1.2],
                        direction: 'alternate',
                        loop: true,
                        delay: anime.stagger(200),
                        duration: 1000,
                        easing: 'easeInOutSine'
                    });
                }
            }, '-=800');
        });
    }

    resetComponent() {
        const shape = this.canvas.querySelector('.morph-shape');
        const patternGroup = this.canvas.querySelector('.pattern-group');
        
        // Stop all running animations
        anime.remove(shape);
        anime.remove(patternGroup);
        anime.remove('.pattern-group circle');
        
        // Reset to initial state
        anime({
            targets: [shape, patternGroup],
            opacity: [null, shape.getAttribute('fill') === '#FF6B6B' ? 1 : 0],
            scale: 1,
            rotate: 0,
            fill: '#FF6B6B',
            d: 'M-50,-50 L50,-50 L50,50 L-50,50 Z',
            transform: 'rotate(0) scale(1)',
            duration: 0
        });
    }
}

export default AnimatedInput; 