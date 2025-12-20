// 全局变量
let currentUser = null;
let gameState = {
    levels: {
        'chapter1': [true, false, false, false, false],
        'chapter2': [false, false, false, false, false],
        'chapter3': [false, false, false, false, false],
        'chapter4': [false, false, false, false, false],
        'chapter5': [false, false, false, false, false],
        'chapter6': [false, false, false, false, false]
    },
    characters: [
        { id: 'c1', name: '程序员', unlocked: false, image: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D', description: '擅长编程的火柴人', skills: ['快速编码', '调试修复', '算法攻击'] },
        { id: 'c2', name: '黑客', unlocked: false, image: 'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/89e01bdf9a384a358f1a5a4d78b9f155~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797673&x-signature=bkbSA8R%2FgiUq8RmmajdVXltux6g%3D', description: '精通网络攻击的火柴人', skills: ['病毒注入', '数据窃取', '后门植入'] },
        { id: 'c3', name: '算法大师', unlocked: false, image: '', description: '掌握高级算法的火柴人', skills: ['动态规划', '图论攻击', '数据结构'] },
        { id: 'c4', name: '系统架构师', unlocked: false, image: '', description: '构建系统的火柴人', skills: ['分布式攻击', '负载均衡', '容错机制'] },
        { id: 'c5', name: 'AI专家', unlocked: false, image: '', description: '人工智能专家火柴人', skills: ['机器学习', '神经网络', '深度学习'] },
        { id: 'c6', name: 'CCF主席', unlocked: false, image: '', description: '终极BOSS', skills: ['政策制定', '标准审核', '权威判决'] }
    ],
    currentCharacter: null
};

// 账号系统 - 增强版加密
function createAccount(username) {
    // 解锁第一章角色
    const newGameState = JSON.parse(JSON.stringify(gameState));
    newGameState.characters[0].unlocked = true;
    newGameState.currentCharacter = 'c1';
    
    const userData = {
        username: username,
        gameState: newGameState,
        createdAt: new Date().toISOString(),
        version: '1.0',
        hash: generateHash(username + Date.now())
    };
    
    // 多层加密
    let secretKey = JSON.stringify(userData);
    secretKey = btoa(secretKey);
    secretKey = reverseString(secretKey);
    secretKey = btoa(secretKey);
    
    localStorage.setItem('currentUser', JSON.stringify({ username, secretKey }));
    currentUser = { username, secretKey };
    return secretKey;
}

function loginWithKey(secretKey) {
    try {
        // 多层解密
        let decrypted = atob(secretKey);
        decrypted = reverseString(decrypted);
        decrypted = atob(decrypted);
        
        const userData = JSON.parse(decrypted);
        
        if (userData.username && userData.gameState && userData.hash === generateHash(userData.username + new Date(userData.createdAt).getTime())) {
            localStorage.setItem('currentUser', JSON.stringify({ username: userData.username, secretKey }));
            currentUser = { username: userData.username, secretKey };
            gameState = userData.gameState;
            return true;
        }
        return false;
    } catch (e) {
        console.error('Login error:', e);
        return false;
    }
}

// 辅助加密函数
function generateHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

function reverseString(str) {
    return str.split('').reverse().join('');
}

function saveProgress() {
    if (currentUser) {
        const userData = {
            username: currentUser.username,
            gameState: gameState,
            createdAt: new Date().toISOString()
        };
        const secretKey = btoa(JSON.stringify(userData));
        currentUser.secretKey = secretKey;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// 游戏逻辑
class FightGame {
    constructor(playerElement, enemyElement, playerHealthElement, enemyHealthElement, timerElement) {
        this.player = playerElement;
        this.enemy = enemyElement;
        this.playerHealth = playerHealthElement;
        this.enemyHealth = enemyHealthElement;
        this.timer = timerElement;
        
        this.playerHealthValue = 100;
        this.enemyHealthValue = 100;
        this.timeLeft = 120;
        this.gameRunning = false;
        this.animationFrameId = null;
        
        this.initControls();
    }
    
    initControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key.toLowerCase()) {
                case 'w':
                    this.movePlayer('up');
                    break;
                case 's':
                    this.movePlayer('down');
                    break;
                case 'a':
                    this.movePlayer('left');
                    break;
                case 'd':
                    this.movePlayer('right');
                    break;
                case 'i':
                    this.attack('normal');
                    break;
                case 'j':
                    this.attack('skill1');
                    break;
                case 'k':
                    this.attack('skill2');
                    break;
                case 'l':
                    this.attack('skill3');
                    break;
            }
        });
    }
    
    start() {
        this.gameRunning = true;
        this.startTimer();
        this.startEnemyAI();
    }
    
    movePlayer(direction) {
        const rect = this.player.getBoundingClientRect();
        const arenaRect = document.querySelector('.game-arena').getBoundingClientRect();
        const moveSpeed = 30; // 增加移动速度使动作更流畅
        
        // 添加移动动画类
        this.player.classList.add('moving');
        
        switch(direction) {
            case 'up':
                this.player.style.bottom = Math.min(arenaRect.height - rect.height, parseInt(this.player.style.bottom || 0) + moveSpeed) + 'px';
                break;
            case 'down':
                this.player.style.bottom = Math.max(0, parseInt(this.player.style.bottom || 0) - moveSpeed) + 'px';
                break;
            case 'left':
                this.player.style.left = Math.max(0, parseInt(this.player.style.left || 100) - moveSpeed) + 'px';
                break;
            case 'right':
                this.player.style.left = Math.min(arenaRect.width - rect.width, parseInt(this.player.style.left || 100) + moveSpeed) + 'px';
                break;
        }
        
        // 移除移动动画类
        setTimeout(() => {
            this.player.classList.remove('moving');
        }, 100);
    }
    
    attack(type) {
        // 防止连续攻击
        if (this.isAttacking) return;
        this.isAttacking = true;
        
        this.player.classList.add('attacking');
        
        // 创建攻击特效
        const attackEffect = document.createElement('div');
        attackEffect.className = 'attack-effect';
        attackEffect.style.position = 'absolute';
        attackEffect.style.width = '50px';
        attackEffect.style.height = '20px';
        attackEffect.style.backgroundColor = type.startsWith('skill') ? '#00ff00' : '#ffffff';
        attackEffect.style.borderRadius = '10px';
        attackEffect.style.zIndex = '10';
        attackEffect.style.opacity = '0.8';
        
        const playerRect = this.player.getBoundingClientRect();
        attackEffect.style.left = (playerRect.right - 25) + 'px';
        attackEffect.style.top = (playerRect.top + playerRect.height / 2 - 10) + 'px';
        
        document.querySelector('.game-arena').appendChild(attackEffect);
        
        // 攻击动画
        let pos = 0;
        const attackInterval = setInterval(() => {
            pos += 5;
            attackEffect.style.left = (playerRect.right - 25 + pos) + 'px';
            
            const enemyRect = this.enemy.getBoundingClientRect();
            if (attackEffect.getBoundingClientRect().right > enemyRect.left && 
                attackEffect.getBoundingClientRect().left < enemyRect.right &&
                attackEffect.getBoundingClientRect().top < enemyRect.bottom && 
                attackEffect.getBoundingClientRect().bottom > enemyRect.top) {
                
                let damage = 10;
                let color = '#ffffff';
                
                switch(type) {
                    case 'skill1':
                        damage = 20;
                        color = '#00ff00';
                        break;
                    case 'skill2':
                        damage = 30;
                        color = '#0080ff';
                        break;
                    case 'skill3':
                        damage = 40;
                        color = '#ff00ff';
                        break;
                }
                
                attackEffect.style.backgroundColor = color;
                
                this.enemyHealthValue = Math.max(0, this.enemyHealthValue - damage);
                this.enemyHealth.style.width = this.enemyHealthValue + '%';
                
                this.enemy.classList.add('damaged');
                
                if (this.enemyHealthValue <= 0) {
                    this.endGame('win');
                }
            }
            
            if (pos > 100) {
                clearInterval(attackInterval);
                document.querySelector('.game-arena').removeChild(attackEffect);
            }
        }, 16);
        
        setTimeout(() => {
            this.player.classList.remove('attacking');
            this.enemy.classList.remove('damaged');
            this.isAttacking = false;
        }, 300);
    }
    
    enemyAttack() {
        if (!this.gameRunning) return;
        
        this.enemy.style.left = (parseInt(this.enemy.style.left || 0) - 50) + 'px';
        
        setTimeout(() => {
            const playerRect = this.player.getBoundingClientRect();
            const enemyRect = this.enemy.getBoundingClientRect();
            
            if (playerRect.right > enemyRect.left && playerRect.left < enemyRect.right &&
                playerRect.top < enemyRect.bottom && playerRect.bottom > enemyRect.top) {
                
                this.playerHealthValue = Math.max(0, this.playerHealthValue - 15);
                this.playerHealth.style.width = this.playerHealthValue + '%';
                
                this.player.classList.add('damaged');
                setTimeout(() => this.player.classList.remove('damaged'), 500);
                
                if (this.playerHealthValue <= 0) {
                    this.endGame('lose');
                }
            }
            
            this.enemy.style.left = (parseInt(this.enemy.style.left || 0) + 50) + 'px';
        }, 300);
    }
    
    startEnemyAI() {
        const aiInterval = setInterval(() => {
            if (!this.gameRunning) {
                clearInterval(aiInterval);
                return;
            }
            
            // 随机移动
            const actions = ['left', 'right', 'attack'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            
            if (action === 'attack') {
                this.enemyAttack();
            } else {
                const arenaRect = document.querySelector('.game-arena').getBoundingClientRect();
                const enemyRect = this.enemy.getBoundingClientRect();
                
                if (action === 'left') {
                    this.enemy.style.left = Math.max(arenaRect.width / 2, parseInt(this.enemy.style.left || 0) - 30) + 'px';
                } else {
                    this.enemy.style.left = Math.min(arenaRect.width - enemyRect.width, parseInt(this.enemy.style.left || 0) + 30) + 'px';
                }
            }
        }, 2000);
    }
    
    startTimer() {
        const timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timer.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(timerInterval);
                this.endGame(this.playerHealthValue > this.enemyHealthValue ? 'win' : 'lose');
            }
        }, 1000);
    }
    
    endGame(result) {
        this.gameRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        
        const gameOver = document.createElement('div');
        gameOver.className = 'game-over';
        gameOver.innerHTML = `
            <div class="result">${result === 'win' ? '胜利！' : '失败！'}</div>
            ${result === 'win' ? '<button class="next-button">下一关</button>' : ''}
            <button class="retry-button">重试</button>
        `;
        
        document.querySelector('.game-container').appendChild(gameOver);
        
        if (result === 'win') {
            gameOver.querySelector('.next-button').addEventListener('click', () => {
                // 解锁下一关逻辑
                const currentLevel = window.location.pathname.split('/').pop().replace('.html', '');
                const levelNumber = parseInt(currentLevel.replace('level', ''));
                const chapterNumber = Math.ceil(levelNumber / 5);
                
                if (levelNumber % 5 === 0) {
                    // 解锁下一章
                    gameState.levels[`chapter${chapterNumber + 1}`][0] = true;
                    // 解锁新角色
                    if (chapterNumber < 6) {
                        gameState.characters[chapterNumber].unlocked = true;
                    }
                } else {
                    // 解锁本章下一关
                    gameState.levels[`chapter${chapterNumber}`][levelNumber % 5] = true;
                }
                
                saveProgress();
                
                // 跳转到下一关或主页
                if (levelNumber % 5 === 0) {
                    window.location.href = `chapter${chapterNumber + 1}.html`;
                } else {
                    window.location.href = `level${levelNumber + 1}.html`;
                }
            });
        }
        
        gameOver.querySelector('.retry-button').addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查当前用户
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        try {
            const userData = JSON.parse(atob(currentUser.secretKey));
            gameState = userData.gameState;
        } catch (e) {
            console.error('Invalid secret key');
        }
    }
    
    // 根据页面类型初始化
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'login.html') {
        initLoginPage();
    } else if (currentPage === 'index.html') {
        initMainPage();
    } else if (currentPage === 'characters.html') {
        initCharactersPage();
    } else if (currentPage.startsWith('chapter')) {
        initChapterPage();
    } else if (currentPage.startsWith('level')) {
        initLevelPage();
    }
});

// 登录页面初始化
function initLoginPage() {
    const createForm = document.getElementById('create-form');
    const loginForm = document.getElementById('login-form');
    
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('create-username').value;
            if (username) {
                const secretKey = createAccount(username);
                alert(`账号创建成功！秘钥：${secretKey}`);
                window.location.href = 'index.html';
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const secretKey = document.getElementById('login-key').value;
            if (loginWithKey(secretKey)) {
                window.location.href = 'index.html';
            } else {
                alert('无效的秘钥！');
            }
        });
    }
}

// 主页初始化
function initMainPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // 显示用户信息
    document.querySelector('.username').textContent = currentUser.username;
    document.querySelector('.secret-key span').textContent = currentUser.secretKey;
    
    // 复制秘钥功能
    document.querySelector('.copy-button').addEventListener('click', () => {
        navigator.clipboard.writeText(currentUser.secretKey).then(() => {
            alert('秘钥已复制到剪贴板！');
        });
    });
    
    // 角色按钮
    document.querySelector('.characters-button').addEventListener('click', () => {
        window.location.href = 'characters.html';
    });
    
    // 计算机点击事件
    const computers = document.querySelectorAll('.computer');
    computers.forEach((computer, index) => {
        const chapterNumber = index + 1;
        const isUnlocked = chapterNumber === 1 || gameState.levels[`chapter${chapterNumber - 1}`][4];
        
        if (!isUnlocked) {
            computer.classList.add('locked');
            computer.querySelector('.lock-icon').style.display = 'block';
        } else {
            computer.addEventListener('click', () => {
                window.location.href = `chapter${chapterNumber}.html`;
            });
        }
    });
}

// 角色页面初始化
function initCharactersPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const charactersGrid = document.querySelector('.characters-grid');
    charactersGrid.innerHTML = '';
    
    gameState.characters.forEach(character => {
        const card = document.createElement('div');
        card.className = `character-card ${character.unlocked ? '' : 'locked'}`;
        
        card.innerHTML = `
            <img src="${character.image || 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D'}" alt="${character.name}" class="character-image">
            <h3 class="character-name">${character.name}</h3>
            <p class="character-description">${character.description}</p>
            <ul class="skills-list">
                ${character.skills.map(skill => `<li class="skill-item"><span>${skill}</span></li>`).join('')}
            </ul>
            ${character.unlocked ? '<button class="select-button">选择</button>' : '<div class="locked-text">未解锁</div>'}
        `;
        
        if (character.unlocked) {
            card.querySelector('.select-button').addEventListener('click', () => {
                gameState.currentCharacter = character.id;
                saveProgress();
                alert(`已选择角色：${character.name}`);
            });
        }
        
        charactersGrid.appendChild(card);
    });
    
    // 返回按钮
    document.querySelector('.back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// 章节页面初始化
function initChapterPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const chapterNumber = window.location.pathname.split('/').pop().replace('chapter', '').replace('.html', '');
    const levels = gameState.levels[`chapter${chapterNumber}`];
    
    const levelsGrid = document.querySelector('.levels-grid');
    levelsGrid.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ${levels[i] ? '' : 'locked'}`;
        
        levelCard.innerHTML = `
            <div class="level-number">${i + 1}</div>
            <div class="level-title">${getAlgorithmName(chapterNumber, i)}</div>
            ${!levels[i] ? '<div class="lock-icon">🔒</div>' : ''}
        `;
        
        if (levels[i]) {
            levelCard.addEventListener('click', () => {
                window.location.href = `level${(chapterNumber - 1) * 5 + i + 1}.html`;
            });
        }
        
        levelsGrid.appendChild(levelCard);
    }
    
    // 返回按钮
    document.querySelector('.back-button').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// 关卡页面初始化
function initLevelPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const levelNumber = parseInt(window.location.pathname.split('/').pop().replace('level', '').replace('.html', ''));
    const chapterNumber = Math.ceil(levelNumber / 5);
    const levelIndex = (levelNumber - 1) % 5;
    
    // 检查关卡是否解锁
    if (!gameState.levels[`chapter${chapterNumber}`][levelIndex]) {
        window.location.href = `chapter${chapterNumber}.html`;
        return;
    }
    
    // 初始化游戏
    const player = document.querySelector('.player');
    const enemy = document.querySelector('.enemy');
    const playerHealth = document.querySelector('.player-health .health');
    const enemyHealth = document.querySelector('.enemy-health .health');
    const timer = document.querySelector('.timer');
    
    // 设置角色图片
    const currentCharacter = gameState.characters.find(c => c.id === gameState.currentCharacter) || gameState.characters[0];
    player.style.backgroundImage = `url(${currentCharacter.image})`;
    enemy.style.backgroundImage = `url(https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/89e01bdf9a384a358f1a5a4d78b9f155~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797673&x-signature=bkbSA8R%2FgiUq8RmmajdVXltux6g%3D)`;
    
    const game = new FightGame(player, enemy, playerHealth, enemyHealth, timer);
    game.start();
}

// 辅助函数
function getAlgorithmName(chapterNumber, levelIndex) {
    const algorithms = {
        '1': ['顺序结构', '选择结构', '循环结构', '数组操作', '函数调用'],
        '2': ['二分查找', '线性查找', '排序算法', '递归思想', '贪心算法'],
        '3': ['动态规划', '图论基础', '深度优先', '广度优先', '最短路径'],
        '4': ['数据结构', '高级算法', '数学建模', '字符串处理', '计算几何'],
        '5': ['算法优化', '复杂度分析', '并行计算', '分布式算法', 'AI算法'],
        '6': ['最终挑战', '综合测试', '极限编程', '代码审查', 'CCF认证']
    };
    
    return algorithms[chapterNumber][levelIndex] || '未知算法';
}

// 禁用右键菜单和Ctrl组合键
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey) e.preventDefault();
});
