// Challenges functionality
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('ctf_user'));
    
    if (!user) {
        window.location.href = '../login.html';
        return;
    }
    
    // Update user welcome
    const userWelcome = document.getElementById('user-welcome');
    if (userWelcome) {
        userWelcome.textContent = `OPERATOR: ${user.username}`;
    }
    
    // Load challenge status
    loadChallengeStatus(user);
});

function loadChallengeStatus(user) {
    // This would typically load from server
    // For now, we'll use localStorage
    const challengeStatus = JSON.parse(localStorage.getItem('challenge_status') || '{}');
    
    // Update challenge cards based on completion status
    document.querySelectorAll('.challenge-card').forEach(card => {
        const challengeName = card.querySelector('h3').textContent;
        if (user.completed && user.completed.find(c => c.challengeName === challengeName)) {
            card.classList.add('completed');
            card.classList.remove('available', 'locked');
        }
    });
}

function viewChallenge(challengePath) {
    window.location.href = `${challengePath}/index.html`;
}

function submitFlag(challengeName, points) {
    const flagInput = document.getElementById('flag-input');
    const flag = flagInput.value.trim();
    
    // Check flag format
    if (!flag.startsWith('SWG{') || !flag.endsWith('}')) {
        alert('INVALID FLAG FORMAT! Flag must be in format: SWG{flag_here}');
        return;
    }
    
    // In real implementation, this would verify with server
    // For demo, we'll accept any flag with correct format
    const user = JSON.parse(localStorage.getItem('ctf_user'));
    const users = JSON.parse(localStorage.getItem('ctf_users') || '[]');
    
    // Check if already completed
    if (user.completed && user.completed.find(c => c.challengeName === challengeName)) {
        alert('CHALLENGE ALREADY COMPLETED!');
        return;
    }
    
    // Add to completed challenges
    if (!user.completed) user.completed = [];
    user.completed.push({
        challengeName: challengeName,
        points: points,
        timestamp: new Date().toISOString(),
        flag: flag
    });
    
    // Update points
    user.points = (user.points || 0) + points;
    
    // Update user in users list
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        if (!users[userIndex].completed) users[userIndex].completed = [];
        users[userIndex].completed.push({
            challengeName: challengeName,
            points: points,
            timestamp: new Date().toISOString()
        });
        users[userIndex].points = (users[userIndex].points || 0) + points;
    }
    
    // Save updates
    localStorage.setItem('ctf_user', JSON.stringify(user));
    localStorage.setItem('ctf_users', JSON.stringify(users));
    
    alert(`CHALLENGE COMPLETED! +${points} points awarded.`);
    window.location.href = '../../dashboard.html';
}

function logout() {
    localStorage.removeItem('ctf_user');
    window.location.href = '../../index.html';
}
