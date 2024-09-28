// Initialize Supabase client
const supabaseUrl = 'https://tdtcqcqdsavurdyappcw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdGNxY3Fkc2F2dXJkeWFwcGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxOTU2ODAsImV4cCI6MjA0Mjc3MTY4MH0.a7ygsIPPozqU4Q5tMJDorUFt3XE4Hrw5KabHdIsp5VI';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        await handleIndexPage();
    } else if (currentPage === 'login.html') {
        await handleLoginPage();
    } else if (currentPage === 'signup.html') {
        await handleSignupPage();
    }
});

async function handleIndexPage() {
    const loadingElement = document.getElementById('loading');
    const contentElement = document.getElementById('content');

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const welcomeMessage = document.querySelector('#welcome h3');
        welcomeMessage.textContent = `Welcome ${user.email},`;

        loadingElement.classList.add('hidden');
        contentElement.classList.remove('hidden');

        setupEventListeners(user);
    } catch (error) {
        console.error('Authentication error:', error.message);
        loadingElement.textContent = 'An error occurred. Please try again.';
    }
}

async function handleLoginPage() {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

async function handleSignupPage() {
    const form = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords don't match";
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            window.location.href = 'index.html';
        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

function setupEventListeners(user) {
    const shopLink = document.getElementById('shop-link');
    const shopContent = document.getElementById('shop_content');
    const logoutLink = document.getElementById('my_account');
    const menuToggle = document.getElementById('menu-toggle');

    if (shopLink) {
        shopLink.addEventListener('click', function(e) {
            e.preventDefault();
            shopContent.classList.toggle('show');
        });
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error signing out:', error.message);
            }
        });
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
        });
    }
}