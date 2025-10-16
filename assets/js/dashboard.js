// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('ctf_user'));
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user welcome
    document.getElementById('user-welcome').textContent = `OPERATOR: ${user.username}`;
    
    // Load dashboard data
    loadDashboardData(user);
    loadScoreboard();
    
    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        document.getElementById('profile-username').value = user.username;
        document.getElementById('profile-email').value = user.email;
        
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProfile(user);
        });
    }
});

function loadDashboardData(user) {
    // Update stats
    const completedCount = user.completed ? user.completed.length : 0;
    const totalPoints = user.points || 0;
    
    document.getElementById('completed-count').textContent = `${completedCount}/15`;
    document.getElementById('total-points').textContent = totalPoints;
    document.getElementById('success-rate').textContent = `${Math.round((completedCount / 15) * 100)}%`;
    
    // Calculate rank
    const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
    const sortedUsers = users.sort((a, b) => (b.points || 0) - (a.points || 0));
    const userRank = sortedUsers.findIndex(u => u.username === user.username) + 1;
    document.getElementById('current-rank').textContent = `#${userRank}`;
    
    // Load recent activity
    loadRecentActivity(user);
}

function loadRecentActivity(user) {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    if (!user.completed || user.completed.length === 0) {
        activityList.innerHTML = '<p style="color: var(--text-muted);">No recent activity</p>';
        return;
    }
    
    const recentActivities = user.completed.slice(-5).reverse();
    activityList.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="challenge-name">Completed: ${activity.challengeName}</div>
            <div class="timestamp">${new Date(activity.timestamp).toLocaleString()}</div>
            <div class="points">+${activity.points} points</div>
        </div>
    `).join('');
}

function loadScoreboard() {
    const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
    const sortedUsers = users.sort((a, b) => (b.points || 0) - (a.points || 0));
    const currentUser = JSON.parse(localStorage.getItem('ctf_user'));
    
    const scoreboardBody = document.getElementById('scoreboard-body');
    if (!scoreboardBody) return;
    
    scoreboardBody.innerHTML = sortedUsers.map((user, index) => {
        const isCurrentUser = user.username === currentUser.username;
        const rowClass = isCurrentUser ? 'style="background: rgba(0, 255, 65, 0.1);"' : '';
        const completedCount = user.completed ? user.completed.length : 0;
        const successRate = Math.round((completedCount / 15) * 100);
        
        return `
            <tr ${rowClass}>
                <td>#${index + 1}</td>
                <td>${user.username} ${isCurrentUser ? '(YOU)' : ''}</td>
                <td>${user.points || 0}</td>
                <td>${completedCount}/15</td>
                <td>${successRate}%</td>
            </tr>
        `;
    }).join('');
}

function showDashboardTab(tabName) {
    // Hide all tabs
    document.getElementById('overview-tab').style.display = 'none';
    document.getElementById('challenges-tab').style.display = 'none';
    document.getElementById('scoreboard-tab').style.display = 'none';
    document.getElementById('profile-tab').style.display = 'none';
    
    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';
    
    // Update active menu
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Reload data if needed
    if (tabName === 'scoreboard') {
        loadScoreboard();
    }
}

function updateProfile(currentUser) {
    const newUsername = document.getElementById('profile-username').value;
    const newEmail = document.getElementById('profile-email').value;
    const newPassword = document.getElementById('profile-password').value;
    
    // Update users list
    const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        users[userIndex].email = newEmail;
        if (newPassword) {
            users[userIndex].password = newPassword;
        }
        localStorage.setItem('ctf_users', JSON.stringify(users));
    }
    
    // Update current user
    currentUser.username = newUsername;
    currentUser.email = newEmail;
    localStorage.setItem('ctf_user', JSON.stringify(currentUser));
    
    // Update welcome message
    document.getElementById('user-welcome').textContent = `OPERATOR: ${newUsername}`;
    
    alert('PROFILE UPDATED SUCCESSFULLY!');
}

function logout() {
    localStorage.removeItem('ctf_user');
    window.location.href = 'index.html';
}
