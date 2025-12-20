// 测试登录功能
console.log('Testing login functionality...');

// 模拟localStorage
const localStorage = {
    data: {},
    setItem(key, value) {
        this.data[key] = value;
        console.log('localStorage set:', key, value.substring(0, 100) + '...');
    },
    getItem(key) {
        return this.data[key];
    },
    removeItem(key) {
        delete this.data[key];
    }
};

// 测试账号创建
function testCreateAccount() {
    console.log('\n=== Testing Create Account ===');
    try {
        const username = 'testuser';
        const userData = {
            username: username,
            gameState: { levels: {}, characters: [] },
            createdAt: new Date().toISOString(),
            version: '1.0',
            hash: 'testhash'
        };
        
        let secretKey = JSON.stringify(userData);
        secretKey = btoa(secretKey);
        secretKey = secretKey.split('').reverse().join('');
        secretKey = btoa(secretKey);
        
        console.log('Generated secret key (first 50 chars):', secretKey.substring(0, 50) + '...');
        console.log('Secret key length:', secretKey.length);
        
        return secretKey;
    } catch (error) {
        console.error('Create account error:', error.message);
        return null;
    }
}

// 测试登录
function testLogin(secretKey) {
    console.log('\n=== Testing Login ===');
    try {
        let decrypted = atob(secretKey);
        decrypted = decrypted.split('').reverse().join('');
        decrypted = atob(decrypted);
        
        const userData = JSON.parse(decrypted);
        console.log('Decrypted successfully:', userData.username);
        return true;
    } catch (error) {
        console.error('Login error:', error.message);
        return false;
    }
}

// 运行测试
const secretKey = testCreateAccount();
if (secretKey) {
    const loginSuccess = testLogin(secretKey);
    console.log('\nLogin test result:', loginSuccess ? 'SUCCESS' : 'FAILED');
}

console.log('\n=== Test completed ===');
