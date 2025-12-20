// 简化版游戏脚本 - 专注于核心功能

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

// 账号系统
function createAccount(username) {
    console.log('Creating account for:', username);
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
    secretKey = utf8_to_b64(secretKey);
    secretKey = reverseString(secretKey);
    secretKey = utf8_to_b64(secretKey);
    
    localStorage.setItem('currentUser', JSON.stringify({ username, secretKey }));
    currentUser = { username, secretKey };
    return secretKey;
}

function loginWithKey(secretKey) {
    console.log('Login with key:', secretKey);
    try {
        // 多层解密
        let decrypted = b64_to_utf8(secretKey);
        decrypted = reverseString(decrypted);
        decrypted = b64_to_utf8(decrypted);
        
        const userData = JSON.parse(decrypted);
        
        if (userData.username && userData.gameState) {
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

function saveProgress() {
    if (currentUser) {
        const userData = {
            username: currentUser.username,
            gameState: gameState,
            createdAt: new Date().toISOString(),
            version: '1.0',
            hash: generateHash(currentUser.username + Date.now())
        };
        
        // 使用与createAccount相同的多层加密
        let secretKey = JSON.stringify(userData);
        secretKey = utf8_to_b64(secretKey);
        secretKey = reverseString(secretKey);
        secretKey = utf8_to_b64(secretKey);
        
        currentUser.secretKey = secretKey;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
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

// 游戏逻辑类
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
        this.isAttacking = false;
        
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
        const moveSpeed = 30;
        
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
        
        setTimeout(() => {
            this.player.classList.remove('moving');
        }, 100);
    }
    
    attack(type) {
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
                const currentLevel = window.location.pathname.split('/').pop().replace('.html', '');
                const levelNumber = parseInt(currentLevel.replace('level', ''));
                const chapterNumber = Math.ceil(levelNumber / 5);
                
                if (levelNumber % 5 === 0) {
                    gameState.levels[`chapter${chapterNumber + 1}`][0] = true;
                    if (chapterNumber < 6) {
                        gameState.characters[chapterNumber].unlocked = true;
                    }
                } else {
                    gameState.levels[`chapter${chapterNumber}`][levelNumber % 5] = true;
                }
                
                saveProgress();
                
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

// 页面初始化函数
function initLoginPage() {
    const createForm = document.getElementById('create-form');
    const loginForm = document.getElementById('login-form');
    
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('create-username').value;
            if (username) {
                try {
                    const secretKey = createAccount(username);
                    alert(`账号创建成功！秘钥：${secretKey}`);
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Create account error:', error);
                    alert('创建账号时出错：' + error.message);
                }
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const secretKey = document.getElementById('login-key').value;
            if (secretKey) {
                try {
                    if (loginWithKey(secretKey)) {
                        alert('登录成功！');
                        window.location.href = 'index.html';
                    } else {
                        alert('无效的秘钥！');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('登录时出错：' + error.message);
                }
            }
        });
    }
}

function initMainPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    console.log('Initializing main page for user:', currentUser.username);
    
    try {
        document.querySelector('.username').textContent = currentUser.username;
        document.querySelector('.secret-key span').textContent = currentUser.secretKey;
        
        document.querySelector('.copy-button').addEventListener('click', () => {
            navigator.clipboard.writeText(currentUser.secretKey).then(() => {
                alert('秘钥已复制到剪贴板！');
            });
        });
        
        document.querySelector('.characters-button').addEventListener('click', () => {
            window.location.href = 'characters.html';
        });
        
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
    } catch (error) {
        console.error('Main page init error:', error);
        alert('页面初始化失败：' + error.message);
    }
}

function initCharactersPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
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
            
            charactersGrid.appendChild(card);
            
            if (character.unlocked) {
                const selectButton = card.querySelector('.select-button');
                if (selectButton) {
                    selectButton.addEventListener('click', () => {
                        gameState.currentCharacter = character.id;
                        saveProgress();
                        alert(`已选择角色：${character.name}`);
                    });
                }
            }
        });
        
        document.querySelector('.back-button').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    } catch (error) {
        console.error('Characters page init error:', error);
        alert('角色页面初始化失败：' + error.message);
    }
}

function initChapterPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const chapterNumber = window.location.pathname.split('/').pop().replace('chapter', '').replace('.html', '');
        const levels = gameState.levels[`chapter${chapterNumber}`];
        
        if (!levels) {
            alert('章节数据不存在！');
            window.location.href = 'index.html';
            return;
        }
        
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
        
        document.querySelector('.back-button').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    } catch (error) {
        console.error('Chapter page init error:', error);
        alert('章节页面初始化失败：' + error.message);
    }
}

function initLevelPage() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const levelNumber = parseInt(window.location.pathname.split('/').pop().replace('level', '').replace('.html', ''));
        const chapterNumber = Math.ceil(levelNumber / 5);
        const levelIndex = (levelNumber - 1) % 5;
        
        if (!gameState.levels[`chapter${chapterNumber}`] || !gameState.levels[`chapter${chapterNumber}`][levelIndex]) {
            alert('关卡未解锁！');
            window.location.href = `chapter${chapterNumber}.html`;
            return;
        }
        
        const player = document.querySelector('.player');
        const enemy = document.querySelector('.enemy');
        const playerHealth = document.querySelector('.player-health .health');
        const enemyHealth = document.querySelector('.enemy-health .health');
        const timer = document.querySelector('.timer');
        
        if (!player || !enemy || !playerHealth || !enemyHealth || !timer) {
            alert('游戏元素加载失败！');
            return;
        }
        
        const currentCharacter = gameState.characters.find(c => c.id === gameState.currentCharacter) || gameState.characters[0];
        player.style.backgroundImage = `url(${currentCharacter.image})`;
        enemy.style.backgroundImage = `url(https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/89e01bdf9a384a358f1a5a4d78b9f155~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797673&x-signature=bkbSA8R%2FgiUq8RmmajdVXltux6g%3D)`;
        
        const game = new FightGame(player, enemy, playerHealth, enemyHealth, timer);
        game.start();
    } catch (error) {
        console.error('Level page init error:', error);
        alert('关卡页面初始化失败：' + error.message);
    }
}

// 主入口函数
function main() {
    console.log('fightCCF Game Loading...');
    
    // 获取当前页面
    const currentPage = window.location.pathname.split('/').pop();
    console.log('Current page:', currentPage);
    
    // 如果不是登录页面，先检查用户是否已登录
    if (currentPage !== 'login.html') {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            console.log('Found saved user data');
            currentUser = JSON.parse(savedUser);
            try {
                // 使用与loginWithKey相同的多层解密
                let decrypted = b64_to_utf8(currentUser.secretKey);
                decrypted = reverseString(decrypted);
                decrypted = b64_to_utf8(decrypted);
                
                const userData = JSON.parse(decrypted);
                gameState = userData.gameState;
                console.log('User data loaded successfully');
            } catch (e) {
                console.error('Invalid secret key:', e);
                localStorage.removeItem('currentUser');
                currentUser = null;
                window.location.href = 'login.html';
                return;
            }
        } else {
            console.log('No saved user data found');
            window.location.href = 'login.html';
            return;
        }
    }
    
    // 根据页面类型初始化
    console.log('Initializing page...');
    switch(currentPage) {
        case 'login.html':
            initLoginPage();
            break;
        case 'index.html':
            initMainPage();
            break;
        case 'characters.html':
            initCharactersPage();
            break;
        default:
            if (currentPage.startsWith('chapter')) {
                initChapterPage();
            } else if (currentPage.startsWith('level')) {
                initLevelPage();
            } else {
                console.error('Unknown page:', currentPage);
                window.location.href = 'login.html';
            }
    }
    
    console.log('Initialization complete');
}

// 禁用右键菜单和Ctrl组合键
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
    if (e.ctrlKey) e.preventDefault();
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', main);
