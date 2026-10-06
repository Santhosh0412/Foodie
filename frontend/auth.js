/**
 * FOODIE ROLE-BASED ACCESS CONTROL (RBAC) & SESSION MANAGER
 */

const Auth = {
  // Pre-configured default accounts for testing
  DEFAULT_USERS: [
    {
      name: "Foodie Partner Admin",
      email: "admin@foodie.com",
      password: "admin123",
      phone: "9876543210",
      role: "ADMIN"
    },
    {
      name: "Foodie Partner Admin",
      email: "admin@zomato.com",
      password: "admin123",
      phone: "9876543210",
      role: "ADMIN"
    },
    {
      name: "Maruthi Praveen",
      email: "customer@foodie.com",
      password: "user123",
      phone: "9123456789",
      role: "CUSTOMER"
    },
    {
      name: "Maruthi Praveen",
      email: "customer@zomato.com",
      password: "user123",
      phone: "9123456789",
      role: "CUSTOMER"
    }
  ],

  // Get all registered users from localStorage
  getRegisteredUsers() {
    let users = [];
    try {
      const stored = localStorage.getItem('foodie_registered_users');
      if (stored) {
        users = JSON.parse(stored);
      }
    } catch (e) {}

    // Merge default users ensuring correct default passwords
    this.DEFAULT_USERS.forEach(def => {
      const idx = users.findIndex(u => u.email.toLowerCase() === def.email.toLowerCase());
      if (idx === -1) {
        users.push(def);
      } else {
        users[idx].password = def.password; // Enforce default password
      }
    });

    localStorage.setItem('foodie_registered_users', JSON.stringify(users));
    return users;
  },

  // Save registered users list
  saveRegisteredUsers(users) {
    localStorage.setItem('foodie_registered_users', JSON.stringify(users));
  },

  // Get current logged-in user session
  getUser() {
    try {
      const user = localStorage.getItem('foodie_user') || localStorage.getItem('zomato_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  },

  // Save logged-in user session
  setUser(user) {
    localStorage.setItem('foodie_user', JSON.stringify(user));
  },

  // Logout current user
  logout() {
    localStorage.removeItem('foodie_user');
    localStorage.removeItem('zomato_user');
    window.location.href = 'login.html';
  },

  // Perform Login with Strict Password Validation
  login(email, password, role) {
    if (!email || !email.trim()) {
      return { success: false, message: "⚠️ Email address is required." };
    }

    if (!password) {
      return { success: false, message: "⚠️ Password is required to log in." };
    }

    const users = this.getRegisteredUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check if account exists
    const match = users.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      cleanEmail.split('@')[0] === u.email.toLowerCase().split('@')[0]
    );

    if (!match) {
      return { 
        success: false, 
        message: `❌ Account "${cleanEmail}" does not exist. Please click "Sign Up" to create a new account.` 
      };
    }

    // Strict Password Verification
    if (match.password !== password) {
      return { 
        success: false, 
        message: `❌ Incorrect password! Please enter the correct password for ${match.email}.` 
      };
    }

    const userSession = {
      name: match.name,
      email: match.email,
      role: role || match.role || 'CUSTOMER'
    };
    this.setUser(userSession);
    return { success: true, user: userSession };
  },

  // Perform Signup
  signup(name, email, phone, password, role) {
    if (!email || !email.includes('@')) {
      return { success: false, message: "⚠️ Please enter a valid email address." };
    }
    if (!password || password.length < 4) {
      return { success: false, message: "⚠️ Password must be at least 4 characters." };
    }

    const users = this.getRegisteredUsers();
    const cleanEmail = email.trim().toLowerCase();

    const existingIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    const newUser = {
      name: name || 'Foodie User',
      email: cleanEmail,
      phone: phone || '',
      password: password,
      role: role || 'CUSTOMER'
    };

    if (existingIndex > -1) {
      users[existingIndex] = newUser;
    } else {
      users.push(newUser);
    }
    this.saveRegisteredUsers(users);

    const userSession = { name: newUser.name, email: newUser.email, role: newUser.role };
    this.setUser(userSession);
    return { success: true, user: userSession };
  },

  // Redirect based on role
  redirectByRole(role) {
    if (role === 'ADMIN') {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'consumer.html';
    }
  },

  // RBAC Guard — Protect pages by required role
  protectRoute(requiredRole) {
    const user = this.getUser();

    // Not logged in -> Redirect to Login
    if (!user) {
      window.location.href = 'login.html?msg=please_login';
      return false;
    }

    // Attempting to access Admin page without ADMIN role -> Access Denied
    if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
      alert(`⛔ Access Denied!\n\nYou are logged in as "${user.name}" (${user.role}).\nAdmin privileges are required to access the Partner Panel.`);
      window.location.href = 'consumer.html';
      return false;
    }

    // User is authorized
    return true;
  },

  // Render User Badge & Logout Button in Header
  renderUserBadge(containerId) {
    const user = this.getUser();
    if (!user) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const isAdmin = user.role === 'ADMIN';
    const badgeColor = isAdmin ? '#E23744' : '#1E8449';
    const badgeBg = isAdmin ? '#FFF0F1' : '#E8F8F5';
    const roleIcon = isAdmin ? '🛠️' : '🍔';

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; background: ${badgeBg}; border: 1px solid ${badgeColor}33; padding: 6px 14px; border-radius: 50px;">
          <span style="font-size: 1rem;">${roleIcon}</span>
          <span style="font-weight: 700; font-size: 0.88rem; color: #1C1C1C;">${user.name}</span>
          <span style="background: ${badgeColor}; color: white; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.5px;">${user.role}</span>
        </div>
        ${!isAdmin ? `<button onclick="window.openOrdersHistoryModal ? window.openOrdersHistoryModal() : window.location.href='consumer.html?openOrders=true'" style="background: #FFF0F1; border: 1px solid #E23744; color: #E23744; font-weight: 700; font-size: 0.85rem; padding: 6px 14px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;" onmouseover="this.style.background='#E23744'; this.style.color='white';" onmouseout="this.style.background='#FFF0F1'; this.style.color='#E23744';">📦 My Orders</button>` : ''}
        ${isAdmin ? `<a href="consumer.html" style="text-decoration: none; font-size: 0.85rem; font-weight: 600; color: #696969; padding: 6px 12px; border-radius: 8px; background: #f0f0f0; transition: background 0.2s;" onmouseover="this.style.background='#e0e0e0'" onmouseout="this.style.background='#f0f0f0'">Customer View</a>` : `<a href="index.html" style="text-decoration: none; font-size: 0.85rem; font-weight: 600; color: #E23744; padding: 6px 12px; border-radius: 8px; background: #FFF0F1; border: 1px solid #E2374433;">Partner Panel</a>`}
        <button onclick="Auth.logout()" style="background: transparent; border: 1.5px solid #EBEBEB; color: #696969; padding: 6px 14px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#E23744'; this.style.color='#E23744';" onmouseout="this.style.borderColor='#EBEBEB'; this.color='#696969';">
          Logout 🚪
        </button>
      </div>
    `;
  }
};
