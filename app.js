let currentScroll = 0;

// слидер
$(document).ready(function(){
    $('.slider').slick({
        arrows: false,
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        infinite: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });
});

document.addEventListener('DOMContentLoaded', (event) => {
    let currentScroll = 0;
    let prevScroll = -1; // Используется для отслеживания предыдущего экрана
    let isScrolling = false;
    const sections = document.querySelectorAll('.screen-section');
    const maxScroll = sections.length;

    const debounce = (func, delay) => {
        let inDebounce;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(inDebounce);
            inDebounce = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const resetAnimationsOnScreen = (screenIndex) => {
        if (screenIndex === 1) { // Экран 2
            // Сброс для #animated-text
            var spans = document.querySelectorAll('#animated-text span');
            if (spans) {
                spans.forEach(function (span) {
                    while (span.firstChild) {
                        span.parentNode.insertBefore(span.firstChild, span);
                    }
                    span.parentNode.removeChild(span);
                    document.querySelector('#animated-text').opacity = '0.4';
                })

            }
        } else if (screenIndex === 4 || screenIndex === 6) { // Экран 5
            // Сброс для fade-in-div
            const fadeDivs = document.querySelectorAll('#screen5 .fade-in-div');
            fadeDivs.forEach(div => {
                div.classList.remove('visible'); // Удаление класса для повторной анимации
            });
        }
    };

    const handleScroll = (e) => {
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;

        if ((direction === 1 && currentScroll < maxScroll - 1) || (direction === -1 && currentScroll > 0)) {
            prevScroll = currentScroll;
            currentScroll += direction;

            sections[currentScroll].scrollIntoView({ behavior: 'smooth' });
            isScrolling = true;

            // Сброс флага прокрутки после завершения анимации
            setTimeout(() => {
                isScrolling = false;
                resetAnimationsOnScreen(prevScroll); // Сброс анимации на предыдущем экране

                // Активация анимации для текущего экрана
                if (currentScroll === 1) {
                    animateText();
                } else if (currentScroll === 4 || currentScroll === 6) {
                    animateDivs();
                }
            }, 1000); // Задержка должна соответствовать длительности анимации прокрутки
        }
    };

    window.addEventListener('wheel', debounce(handleScroll, 50));
});


window.addEventListener('DOMContentLoaded', (event) => {
    const text = document.getElementById('animated-text');
    const letters = text.innerText.split('');
    text.innerHTML = letters.map(letter => `<span style="opacity: 0.4;">${letter}</span>`).join('');
});

// window.addEventListener('DOMContentLoaded', (event) => {
//     const text = document.getElementById('animated-text');
//     const words = text.innerText.split('');
//     text.innerHTML = words.map(word => `<span style="opacity: 0.4;">${word}</span>`).join('');
// });

const animateText = () => {
    const spans = document.querySelectorAll('#animated-text span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.opacity = 1;
        }, index * 30); // Задержка увеличивается с каждой буквой
    });
};
// появление блоков в htmn
const animateDivs = () => {
    const divs = document.querySelectorAll('#screen5 .fade-in-div, #screen7 .fade-in-div');
    divs.forEach((div, index) => {
        setTimeout(() => {
            div.classList.add('visible');
        }, index * 400); // Задержка увеличивается с каждым дивом
    });
};
//


window.onload = init;
function init() {
    var root = new THREERoot({
        createCameraControls:!true,
        antialias:(window.devicePixelRatio === 1),
        fov:60
    });
    if (window.matchMedia("(max-width: 880px)").matches) {
        // Код для мобильных устройств
        root.camera.position.set(0, 0, 400); // Более близкое расположение камеры
        // Другие настройки специфичные для мобильных устройств
    } else if (window.matchMedia("(max-width: 1024px)").matches) {
        // Код для настольных или планшетных устройств
        root.camera.position.set(0, -300, 1100); // Более близкое расположение камеры
    } else {
        root.camera.position.set(0, 0, 800); // можно уменьшить камеру
    }
    root.renderer.setClearColor(0x101010);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);

    var textAnimation = createTextAnimation();
    root.scene.add(textAnimation);

    var light = new THREE.DirectionalLight();
    light.position.set(0, 0, 1);
    root.scene.add(light);

    var tl = new TimelineMax({
        repeat:-1,
        repeatDelay:0.5,
        yoyo:true
    });
    tl.fromTo(textAnimation, 4,
        {animationProgress:0.0},
        {animationProgress:0.6, ease:Power1.easeInOut},
        0
    );
    tl.fromTo(textAnimation.rotation, 4, {y:0}, {y:Math.PI * 2, ease:Power1.easeInOut}, 0);

    createTweenScrubber(tl);
}
function createTextAnimation() {
    // Определение размера текста в зависимости от ширины экрана
    var isMobile = window.matchMedia('(max-width: 430px)').matches; // Покрывает устройства до 360px включительно
    var isTablet = window.matchMedia('(min-width: 431px) and (max-width: 768px)').matches;
    var isTabletPro = window.matchMedia('(min-width: 834px) and (max-width: 1024px)').matches;
    var isDesktop = window.matchMedia('(min-width: 1100px) and (max-width: 1300px)').matches;
    var isDesktop2 = window.matchMedia('(min-width: 1300px) and (max-width: 1600px)').matches;

    var textSize, textHeight;

    if (isMobile) {
        // Параметры для мобильных устройств
        textSize = 1; // Уменьшенный размер для мобильных устройств
        textHeight = 10; // Уменьшенная высота для мобильных устройств
    } else if (isTablet) {
        // Параметры для планшетных устройств
        textSize = 40; // Уменьшенный размер для планшетных устройств
        textHeight = 12; // Уменьшенная высота для планшетных устройств
    } else if(isTabletPro) {
        // Параметры для настольных компьютеров и других устройств
        textSize = 80; // Стандартный размер
        textHeight = 14; // Стандартная высота
    } else if(isDesktop) {
        textSize = 120; // Стандартный размер
        textHeight = 16; // Стандартная высота
    } else if(isDesktop2) {
        textSize = 140; // Стандартный размер
        textHeight = 18; // Стандартная высота
    }
    var geometry = generateTextGeometry('PostPortal', {
        size: textSize,
        height: textHeight,
        font: 'TT Interphases Pro Trl Blc',
        weight: 'normal',
        style: 'normal',
        curveSegments: 24,
        bevelSize: isTablet ? 1 : 2, // Меньший размер скошенности для мобильных
        bevelThickness: isTablet ? 1 : 2, // Меньшая толщина скошенности для мобильных
        bevelEnabled: true,
        anchor: {x: 0.5, y: 0.5, z: 0.5}
    });
    THREE.BAS.Utils.tessellateRepeat(geometry, 1.0, 2);
    THREE.BAS.Utils.separateFaces(geometry);

    return new TextAnimation(geometry);
}

function generateTextGeometry(text, params) {
    var geometry = new THREE.TextGeometry(text, params);

    geometry.computeBoundingBox();

    var size = geometry.boundingBox.size();
    var anchorX = size.x * -params.anchor.x;
    var anchorY = size.y * -params.anchor.y;
    var anchorZ = size.z * -params.anchor.z;
    var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

    geometry.applyMatrix(matrix);

    return geometry;
}

////////////////////
// CLASSES
////////////////////

function TextAnimation(textGeometry) {
    var bufferGeometry = new THREE.BAS.ModelBufferGeometry(textGeometry);

    var aAnimation = bufferGeometry.createAttribute('aAnimation', 2);
    var aEndPosition = bufferGeometry.createAttribute('aEndPosition', 3);
    var aAxisAngle = bufferGeometry.createAttribute('aAxisAngle', 4);

    var faceCount = bufferGeometry.faceCount;
    var i, i2, i3, i4, v;

    var maxDelay = 0.0;
    var minDuration = 1.0;
    var maxDuration = 1.0;
    var stretch = 0.05;
    var lengthFactor = 0.001;
    var maxLength = textGeometry.boundingBox.max.length();

    this.animationDuration = maxDuration + maxDelay + stretch + lengthFactor * maxLength;
    this._animationProgress = 0;

    var axis = new THREE.Vector3();
    var angle;

    for (i = 0, i2 = 0, i3 = 0, i4 = 0; i < faceCount; i++, i2 += 6, i3 += 9, i4 += 12) {
        var face = textGeometry.faces[i];
        var centroid = THREE.BAS.Utils.computeCentroid(textGeometry, face);
        var centroidN = new THREE.Vector3().copy(centroid).normalize();

        // animation
        var delay = (maxLength - centroid.length()) * lengthFactor;
        var duration = THREE.Math.randFloat(minDuration, maxDuration);

        for (v = 0; v < 6; v += 2) {
            aAnimation.array[i2 + v    ] = delay + stretch * Math.random();
            aAnimation.array[i2 + v + 1] = duration;
        }

        // end position
        var point = utils.fibSpherePoint(i, faceCount, 200);

        for (v = 0; v < 9; v += 3) {
            aEndPosition.array[i3 + v    ] = point.x;
            aEndPosition.array[i3 + v + 1] = point.y;
            aEndPosition.array[i3 + v + 2] = point.z;
        }

        // axis angle
        axis.x = centroidN.x;
        axis.y = -centroidN.y;
        axis.z = -centroidN.z;

        axis.normalize();

        angle = Math.PI * THREE.Math.randFloat(0.5, 2.0);

        for (v = 0; v < 12; v += 4) {
            aAxisAngle.array[i4 + v    ] = axis.x;
            aAxisAngle.array[i4 + v + 1] = axis.y;
            aAxisAngle.array[i4 + v + 2] = axis.z;
            aAxisAngle.array[i4 + v + 3] = angle;
        }
    }

    var material = new THREE.BAS.PhongAnimationMaterial({
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                uTime: {type: 'f', value: 0}
            },
            shaderFunctions: [
                THREE.BAS.ShaderChunk['cubic_bezier'],
                THREE.BAS.ShaderChunk['ease_out_cubic'],
                THREE.BAS.ShaderChunk['quaternion_rotation']
            ],
            shaderParameters: [
                'uniform float uTime;',
                'uniform vec3 uAxis;',
                'uniform float uAngle;',
                'attribute vec2 aAnimation;',
                'attribute vec3 aEndPosition;',
                'attribute vec4 aAxisAngle;'
            ],
            shaderVertexInit: [
                'float tDelay = aAnimation.x;',
                'float tDuration = aAnimation.y;',
                'float tTime = clamp(uTime - tDelay, 0.0, tDuration);',
                'float tProgress = ease(tTime, 0.0, 1.0, tDuration);'
                // 'float tProgress = tTime / tDuration;'
            ],
            shaderTransformPosition: [
                'transformed = mix(transformed, aEndPosition, tProgress);',

                'float angle = aAxisAngle.w * tProgress;',
                'vec4 tQuat = quatFromAxisAngle(aAxisAngle.xyz, angle);',
                'transformed = rotateVector(tQuat, transformed);',
            ]
        },
        {
            // ТУТ МЕНЯЛА ЦВЕТ 1)444444 2) сссссс
            diffuse: 0xE7E7E7,
            specular: 0xDDDDDD,
            shininess: 4
            //emissive:0xffffff
        }
    );

    THREE.Mesh.call(this, bufferGeometry, material);

    this.frustumCulled = false;
}
TextAnimation.prototype = Object.create(THREE.Mesh.prototype);
TextAnimation.prototype.constructor = TextAnimation;

Object.defineProperty(TextAnimation.prototype, 'animationProgress', {
    get: function() {
        return this._animationProgress;
    },
    set: function(v) {
        this._animationProgress = v;
        this.material.uniforms['uTime'].value = this.animationDuration * v;
    }
});

function THREERoot(params) {
    params = utils.extend({
        fov:60,
        zNear:10,
        zFar:100000,

        createCameraControls:true
    }, params);

    this.renderer = new THREE.WebGLRenderer({
        antialias:params.antialias
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    document.getElementById('three-container').appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
        params.fov,
        window.innerWidth / window.innerHeight,
        params.zNear,
        params.zfar
    );

    this.scene = new THREE.Scene();

    if (params.createCameraControls) {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    }

    this.resize = this.resize.bind(this);
    this.tick = this.tick.bind(this);

    this.resize();
    this.tick();

    window.addEventListener('resize', this.resize, false);
}
THREERoot.prototype = {
    tick: function() {
        this.update();
        this.render();
        requestAnimationFrame(this.tick);
    },
    update: function() {
        this.controls && this.controls.update();
    },
    render: function() {
        this.renderer.render(this.scene, this.camera);
    },
    resize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
};

////////////////////
// UTILS
////////////////////

var utils = {
    extend:function(dst, src) {
        for (var key in src) {
            dst[key] = src[key];
        }

        return dst;
    },
    randSign: function() {
        return Math.random() > 0.5 ? 1 : -1;
    },
    ease:function(ease, t, b, c, d) {
        return b + ease.getRatio(t / d) * c;
    },
    // mapEase:function(ease, v, x1, y1, x2, y2) {
    //   var t = v;
    //   var b = x2;
    //   var c = y2 - x2;
    //   var d = y1 - x1;
    //
    //   return utils.ease(ease, t, b, c, d);
    // },
    fibSpherePoint: (function() {
        var v = {x:0, y:0, z:0};
        var G = Math.PI * (3 - Math.sqrt(5));

        return function(i, n, radius) {
            var step = 2.0 / n;
            var r, phi;

            v.y = i * step - 1 + (step * 0.5);
            r = Math.sqrt(1 - v.y * v.y);
            phi = i * G;
            v.x = Math.cos(phi) * r;
            v.z = Math.sin(phi) * r;

            radius = radius || 1;

            v.x *= radius;
            v.y *= radius;
            v.z *= radius;

            return v;
        }
    })()
};
function createTweenScrubber(tween, seekSpeed) {
    seekSpeed = seekSpeed || 0.001;

    function stop() {
        TweenMax.to(tween, 1, {timeScale:0});
    }

    function resume() {
        TweenMax.to(tween, 1, {timeScale:1});
    }

    function seek(dx) {
        var progress = tween.progress();
        var p = THREE.Math.clamp((progress + (dx * seekSpeed)), 0, 1);

        tween.progress(p);
    }

    var _cx = 0;

    // desktop
    var mouseDown = false;
    document.body.style.cursor = 'pointer';

    window.addEventListener('mousedown', function(e) {
        mouseDown = true;
        document.body.style.cursor = 'ew-resize';
        _cx = e.clientX;
        stop();
    });
    window.addEventListener('mouseup', function(e) {
        mouseDown = false;
        document.body.style.cursor = 'pointer';
        resume();
    });
    window.addEventListener('mousemove', function(e) {
        if (mouseDown === true) {
            var cx = e.clientX;
            var dx = cx - _cx;
            _cx = cx;

            seek(dx);
        }
    });
    // mobile
    window.addEventListener('touchstart', function(e) {
        _cx = e.touches[0].clientX;
        stop();
        e.preventDefault();
    });
    window.addEventListener('touchend', function(e) {
        resume();
        e.preventDefault();
    });
    window.addEventListener('touchmove', function(e) {
        var cx = e.touches[0].clientX;
        var dx = cx - _cx;
        _cx = cx;

        seek(dx);
        e.preventDefault();
    });
}
// FAQ
// Toggle Collapse
$('.faq li .question').click(function () {
    $(this).find('.plus-minus-toggle').toggleClass('collapsed');
    $(this).parent().toggleClass('active');
});

// CURSOR
const cursor = document.querySelector(".custom-cursor");
const links = document.querySelectorAll("a");
let isCursorInited = false;

const initCursor = () => {
    cursor.classList.add("custom-cursor--init");
    isCursorInited = true;
};

const destroyCursor = () => {
    cursor.classList.remove("custom-cursor--init");
    isCursorInited = false;
};

links.forEach((link) => {
    link.addEventListener("mouseover", () => {
        cursor.classList.add("custom-cursor--link");
    });

    link.addEventListener("mouseout", () => {
        cursor.classList.remove("custom-cursor--link");
    });
});

document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (!isCursorInited) {
        initCursor();
    }

    cursor.style = `translate: ${mouseX}px ${mouseY}px`;
});

document.addEventListener("mouseout", destroyCursor);




