// fightCCF 游戏核心脚本

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
        { id: 'c3', name: '算法大师', unlocked: false, image: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D', description: '掌握高级算法的火柴人', skills: ['动态规划', '图论攻击', '数据结构'] },
        { id: 'c4', name: '系统架构师', unlocked: false, image: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D', description: '构建系统的火柴人', skills: ['分布式攻击', '负载均衡', '容错机制'] },
        { id: 'c5', name: 'AI专家', unlocked: false, image: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D', description: '人工智能专家火柴人', skills: ['机器学习', '神经网络', '深度学习'] },
        { id: 'c6', name: 'CCF主席', unlocked: false, image: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/super_tool/a5469c415b534e79a33fb60d65e65fef~tplv-a9rns2rl98-image.image?rcl=202512201240470875B743E140E9E6F54C&rk3s=8e244e95&rrcfp=f06b921b&x-expires=1768797662&x-signature=osqBA%2F5y5fpxtTGjJ6Uau8JmKWo%3D', description: '终极BOSS', skills: ['政策制定', '标准审核', '权威判决'] }
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

// UTF-8编码转换函数
function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
    }));
}

function b64_to_utf8(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

// 账号系统
function createAccount(username) {
    console.log('创建账号:', username);
    
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
    console.log('登录秘钥:', secretKey);
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
        console.error('登录失败:', e);
        return false;
    }
}

function loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        try {
            // 解密游戏状态
            let decrypted = b64_to_utf8(currentUser.secretKey);
            decrypted = reverseString(decrypted);
            decrypted = b64_to_utf8(decrypted);
            
            const userData = JSON.parse(decrypted);
            if (userData.gameState) {
                gameState = userData.gameState;
            }
        } catch (e) {
            console.error('加载用户数据失败:', e);
        }
    }
}

function saveGameState() {
    if (currentUser) {
        try {
            const userData = {
                username: currentUser.username,
                gameState: gameState,
                createdAt: new Date().toISOString(),
                version: '1.0',
                hash: generateHash(currentUser.username + Date.now())
            };
            
            let secretKey = JSON.stringify(userData);
            secretKey = utf8_to_b64(secretKey);
            secretKey = reverseString(secretKey);
            secretKey = utf8_to_b64(secretKey);
            
            localStorage.setItem('currentUser', JSON.stringify({ username: currentUser.username, secretKey }));
            currentUser.secretKey = secretKey;
        } catch (e) {
            console.error('保存游戏状态失败:', e);
        }
    }
}

// 算法数据
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

function getAlgorithmDescription(chapterNumber, levelIndex) {
    const descriptions = {
        '1': [
            '按照顺序执行的程序结构',
            '根据条件选择不同执行路径',
            '重复执行某段代码',
            '对数组进行增删改查操作',
            '调用函数完成特定功能'
        ],
        '2': [
            '在有序数组中快速查找元素',
            '从头到尾依次查找元素',
            '将数据按照一定顺序排列',
            '函数调用自身解决问题',
            '在每一步选择最优解'
        ],
        '3': [
            '将复杂问题分解为子问题',
            '研究图的性质和应用',
            '深度优先遍历搜索',
            '广度优先遍历搜索',
            '寻找两点间最短路径'
        ],
        '4': [
            '研究数据的组织方式',
            '高级算法设计与分析',
            '用数学方法解决实际问题',
            '字符串的处理和分析',
            '用几何方法解决问题'
        ],
        '5': [
            '提高算法效率的方法',
            '分析算法的时间和空间复杂度',
            '同时执行多个计算任务',
            '在多台计算机上执行算法',
            '人工智能算法应用'
        ],
        '6': [
            '最终的综合挑战',
            '全面测试编程能力',
            '在极限条件下编程',
            '审查代码质量和安全性',
            'CCF官方认证考试'
        ]
    };
    
    return descriptions[chapterNumber][levelIndex] || '这是一个神秘的算法';
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
        this.isPlaying = false;
        this.gameTimer = null;
        
        this.currentCharacter = gameState.characters.find(c => c.id === gameState.currentCharacter) || gameState.characters[0];
        
        this.initControls();
        this.updateHealthBars();
    }
    
    initControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
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
    
    movePlayer(direction) {
        const rect = this.player.getBoundingClientRect();
        const arenaRect = this.player.parentElement.getBoundingClientRect();
        
        let newLeft = rect.left - arenaRect.left;
        let newTop = rect.top - arenaRect.top;
        
        const moveDistance = 20;
        
        switch(direction) {
            case 'up':
                newTop = Math.max(0, newTop - moveDistance);
                break;
            case 'down':
                newTop = Math.min(arenaRect.height - rect.height, newTop + moveDistance);
                break;
            case 'left':
                newLeft = Math.max(0, newLeft - moveDistance);
                break;
            case 'right':
                newLeft = Math.min(arenaRect.width - rect.width, newLeft + moveDistance);
                break;
        }
        
        this.player.style.left = newLeft + 'px';
        this.player.style.top = newTop + 'px';
    }
    
    attack(type) {
        if (!this.isPlaying) return;
        
        let damage = 0;
        let animation = '';
        
        switch(type) {
            case 'normal':
                damage = 10;
                animation = 'attack';
                break;
            case 'skill1':
                damage = 20;
                animation = 'attack';
                break;
            case 'skill2':
                damage = 30;
                animation = 'attack';
                break;
            case 'skill3':
                damage = 50;
                animation = 'attack';
                break;
        }
        
        // 播放攻击动画
        this.player.classList.add(animation);
        setTimeout(() => {
            this.player.classList.remove(animation);
        }, 500);
        
        // 敌人受伤
        this.enemyHealthValue = Math.max(0, this.enemyHealthValue - damage);
        this.enemy.classList.add('damaged');
        setTimeout(() => {
            this.enemy.classList.remove('damaged');
        }, 500);
        
        this.updateHealthBars();
        
        // 检查胜利条件
        if (this.enemyHealthValue <= 0) {
            this.endGame(true);
            return;
        }
        
        // 敌人反击
        setTimeout(() => {
            this.enemyAttack();
        }, 1000);
    }
    
    enemyAttack() {
        if (!this.isPlaying) return;
        
        const damage = Math.floor(Math.random() * 15) + 5;
        this.playerHealthValue = Math.max(0, this.playerHealthValue - damage);
        this.updateHealthBars();
        
        // 检查失败条件
        if (this.playerHealthValue <= 0) {
            this.endGame(false);
        }
    }
    
    updateHealthBars() {
        this.playerHealth.style.width = this.playerHealthValue + '%';
        this.enemyHealth.style.width = this.enemyHealthValue + '%';
    }
    
    start() {
        this.isPlaying = true;
        this.timeLeft = 120;
        this.updateTimer();
        
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame(this.playerHealthValue > this.enemyHealthValue);
            }
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    endGame(isVictory) {
        this.isPlaying = false;
        clearInterval(this.gameTimer);
        
        if (isVictory) {
            this.player.classList.add('victory');
            setTimeout(() => {
                this.player.classList.remove('victory');
                this.handleVictory();
            }, 2000);
        } else {
            this.player.classList.add('defeat');
            setTimeout(() => {
                this.player.classList.remove('defeat');
                this.handleDefeat();
            }, 2000);
        }
    }
    
    handleVictory() {
        const levelNumber = parseInt(window.location.pathname.split('/').pop().replace('level', '').replace('.html', ''));
        const chapterNumber = Math.ceil(levelNumber / 5);
        const levelIndex = (levelNumber - 1) % 5;
        
        // 更新关卡进度
        gameState.levels[`chapter${chapterNumber}`][levelIndex] = true;
        
        // 检查是否解锁下一章
        if (levelIndex === 4 && chapterNumber < 6) {
            gameState.levels[`chapter${chapterNumber + 1}`][0] = true;
            gameState.characters[chapterNumber].unlocked = true;
            alert(`恭喜解锁新角色：${gameState.characters[chapterNumber].name}！`);
        }
        
        saveGameState();
        
        if (levelIndex === 4) {
            alert('恭喜完成本章！即将前往下一章。');
            window.location.href = `chapters/chapter${chapterNumber + 1}.html`;
        } else {
            alert('关卡完成！');
            window.location.href = `chapters/chapter${chapterNumber}.html`;
        }
    }
    
    handleDefeat() {
        alert('挑战失败！请重试。');
        window.location.reload();
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
                const secretKey = createAccount(username);
                alert(`账号创建成功！\n秘钥：${secretKey}\n\n请保存此秘钥用于后续登录`);
                window.location.href = 'index.html';
            }
        });
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const secretKey = document.getElementById('login-key').value;
            if (secretKey) {
                if (loginWithKey(secretKey)) {
                    alert('登录成功！');
                    window.location.href = 'index.html';
                } else {
                    alert('无效的秘钥！');
                }
            }
        });
    }
}

function initMainPage() {
    loadUserData();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // 显示用户信息
    const usernameDisplay = document.querySelector('.username-display');
    const secretKeyDisplay = document.querySelector('.secret-key-display');
    const copyButton = document.querySelector('.copy-button');
    
    if (usernameDisplay) {
        usernameDisplay.textContent = `用户名: ${currentUser.username}`;
    }
    
    if (secretKeyDisplay) {
        secretKeyDisplay.textContent = `秘钥: ${currentUser.secretKey}`;
    }
    
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(currentUser.secretKey).then(() => {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 2000);
            });
        });
    }
    
    // 角色按钮
    const charactersButton = document.querySelector('.characters-button');
    if (charactersButton) {
        charactersButton.addEventListener('click', () => {
            window.location.href = 'characters.html';
        });
    }
    
    // 计算机网格
    const computers = document.querySelectorAll('.computer');
    computers.forEach((computer, index) => {
        const chapterNumber = index + 1;
        const isUnlocked = chapterNumber === 1 || gameState.levels[`chapter${chapterNumber - 1}`][4];
        
        if (!isUnlocked) {
            computer.classList.add('locked');
            computer.querySelector('.lock-icon').style.display = 'block';
        } else {
            computer.addEventListener('click', () => {
                window.location.href = `chapters/chapter${chapterNumber}.html`;
            });
        }
    });
}

function initCharactersPage() {
    loadUserData();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const charactersGrid = document.querySelector('.characters-grid');
    if (charactersGrid) {
        charactersGrid.innerHTML = '';
        
        gameState.characters.forEach(character => {
            const card = document.createElement('div');
            card.className = `character-card ${character.unlocked ? '' : 'locked'}`;
            
            card.innerHTML = `
                <img src="${character.image}" alt="${character.name}" class="character-image">
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
                selectButton.addEventListener('click', () => {
                    gameState.currentCharacter = character.id;
                    saveGameState();
                    alert(`已选择角色：${character.name}`);
                });
            }
        });
    }
    
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function initChapterPage() {
    loadUserData();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const chapterNumber = window.location.pathname.split('/').pop().replace('chapter', '').replace('.html', '');
    const levels = gameState.levels[`chapter${chapterNumber}`];
    
    const levelsGrid = document.querySelector('.levels-grid');
    if (levelsGrid) {
        levelsGrid.innerHTML = '';
        
        levels.forEach((isUnlocked, index) => {
            const levelCard = document.createElement('div');
            levelCard.className = `level-card ${isUnlocked ? '' : 'locked'}`;
            
            const levelNumber = (chapterNumber - 1) * 5 + index + 1;
            const algorithmName = getAlgorithmName(chapterNumber, index);
            
            levelCard.innerHTML = `
                <div class="level-number">${index + 1}</div>
                <div class="level-title">${algorithmName}</div>
            `;
            
            levelsGrid.appendChild(levelCard);
            
            if (isUnlocked) {
                levelCard.addEventListener('click', () => {
                    window.location.href = `levels/level${levelNumber}.html`;
                });
            }
        });
    }
    
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
}

function initLevelPage() {
    loadUserData();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const levelNumber = parseInt(window.location.pathname.split('/').pop().replace('level', '').replace('.html', ''));
    const chapterNumber = Math.ceil(levelNumber / 5);
    const levelIndex = (levelNumber - 1) % 5;
    
    // 检查关卡是否解锁
    if (!gameState.levels[`chapter${chapterNumber}`] || !gameState.levels[`chapter${chapterNumber}`][levelIndex]) {
        alert('该关卡尚未解锁！');
        window.location.href = `chapter${chapterNumber}.html`;
        return;
    }
    
    // 设置算法信息
    const algorithmNameElement = document.querySelector('.algorithm-name');
    const algorithmDescriptionElement = document.querySelector('.algorithm-description');
    
    if (algorithmNameElement) {
        algorithmNameElement.textContent = getAlgorithmName(chapterNumber, levelIndex);
    }
    
    if (algorithmDescriptionElement) {
        algorithmDescriptionElement.textContent = getAlgorithmDescription(chapterNumber, levelIndex);
    }
    
    // 初始化游戏
    const player = document.querySelector('.player');
    const enemy = document.querySelector('.enemy');
    const playerHealth = document.querySelector('.player .health-fill-inner');
    const enemyHealth = document.querySelector('.enemy .health-fill-inner');
    const timer = document.querySelector('.timer');
    
    if (player && enemy && playerHealth && enemyHealth && timer) {
        const currentCharacter = gameState.characters.find(c => c.id === gameState.currentCharacter) || gameState.characters[0];
        player.style.backgroundImage = `url(${currentCharacter.image})`;
        
        const game = new FightGame(player, enemy, playerHealth, enemyHealth, timer);
        game.start();
    }
    
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = `chapters/chapter${chapterNumber}.html`;
        });
    }
}

// 防作弊机制
function initAntiCheat() {
    // 禁用右键菜单
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // 禁用Ctrl组合键
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 's', 'u', 'a'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            return false;
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initAntiCheat();
    
    const currentPage = window.location.pathname.split('/').pop();
    
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
            }
    }
});
