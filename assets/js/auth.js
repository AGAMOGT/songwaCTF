document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Check if user is already logged in
    const currentUser = localStorage.getItem('ctf_user');
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'dashboard.html';
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            // Simple authentication (in real app, this would be server-side)
            const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
            const user = users.find(u => 
                (u.username === username || u.email === username) && u.password === password
            );
            
            if (user) {
                // Login successful
                localStorage.setItem('ctf_user', JSON.stringify({
                    username: user.username,
                    email: user.email,
                    points: user.points || 0,
                    completed: user.completed || []
                }));
                
                window.location.href = 'dashboard.html';
            } else {
                alert('ACCESS DENIED: Invalid credentials!');
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('ACCESS CODE MISMATCH! VERIFICATION FAILED.');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
            if (users.find(u => u.username === username || u.email === email)) {
                alert('OPERATOR ALREADY EXISTS!');
                return;
            }
            
            // Register new user
            const newUser = {
                email,
                username,
                password,
                points: 0,
                completed: [],
                registeredAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('ctf_users', JSON.stringify(users));
            
            // Auto login after registration
            localStorage.setItem('ctf_user', JSON.stringify({
                username: newUser.username,
                email: newUser.email,
                points: newUser.points,
                completed: newUser.completed
            }));
            
            window.location.href = 'dashboard.html';
        });
    }
});
