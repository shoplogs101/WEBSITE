// Initialize Supabase client
const supabaseUrl = 'https://tdtcqcqdsavurdyappcw.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Add this at the beginning of the file
const baseUrl = window.location.pathname.replace(/\/[^/]*$/, '');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;
                
                // Redirect to index.html on successful login
                window.location.href = `${baseUrl}/index.html`;
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                errorMessage.textContent = "Passwords don't match";
                return;
            }

            try {
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) throw error;
                
                // Redirect to login.html on successful signup
                window.location.href = `${baseUrl}/login.html`;
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
});