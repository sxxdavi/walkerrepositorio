// --- 1. CADASTRE AQUI OS ALUNOS LIBERADOS ---
// Sempre que um novo aluno pagar, adicione o e-mail e a senha dele neste array:
const ALLOWED_USERS = [
    { email: "aluno1@gmail.com", password: "senha123123" },
    { email: "cliente@empresa.com", password: "walquer2026" },
    { email: "walkersenhas01@gmail.com", password: "admin" },
    { email: "adliderdigital@gmail.com", password: "123456" }
     // Sua conta para testes
];

// --- DADOS DAS AULAS DO CURSO ---
// --- DADOS DAS AULAS DO CURSO ---
const lessons = [
    {
        id: 1,
        title: "01. Introdução ao Direito Empresarial",
        duration: "15 min",
        videoUrl: "https://www.youtube.com/embed/kSM10tKtpTo",
        description: "Visão geral sobre a atuação do advogado empresarial e fundamentos principais."
    },
    {
        id: 2,
        title: "02. Contratos Comerciais e Societários",
        duration: "25 min",
        videoUrl: "https://www.youtube.com/embed/oCVW-bUDGxk",
        description: "Como estruturar contratos seguros para proteger a empresa e mitigar riscos."
    },
    {
        id: 3,
        title: "03. Planejamento Tributário para Empresas",
        duration: "20 min",
        videoUrl: "https://www.youtube.com/embed/yBslnHmmLOA",
        description: "Estratégias legais para otimização da carga tributária corporativa."
    },
    {
        id: 4,
        title: "04. Defesa e Blindagem Patrimonial",
        duration: "18 min",
        videoUrl: "https://www.youtube.com/embed/HqCzNmAFH8M",
        description: "Mecanismos e estruturas jurídicas para proteção de bens dos sócios."
    }
];

const CURRENT_USER_KEY = 'dr_walquer_current_user';

// --- RENDERIZAÇÃO DAS AULAS E PLAYER ---
function loadLesson(lesson) {
    const videoPlayer = document.getElementById('video-player');
    const currentTitle = document.getElementById('current-title');
    const currentDesc = document.getElementById('current-desc');

    if (videoPlayer) videoPlayer.src = lesson.videoUrl;
    if (currentTitle) currentTitle.textContent = lesson.title;
    if (currentDesc) currentDesc.textContent = lesson.description;

    document.querySelectorAll('.lesson-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.id) === lesson.id) {
            item.classList.add('active');
        }
    });
}

function renderLessons() {
    const lessonList = document.getElementById('lesson-list');
    if (!lessonList) return;

    lessonList.innerHTML = '';

    lessons.forEach((lesson, index) => {
        const li = document.createElement('li');
        li.className = `lesson-item ${index === 0 ? 'active' : ''}`;
        li.dataset.id = lesson.id;

        li.innerHTML = `
            <div class="lesson-index">${index + 1}</div>
            <div class="lesson-details">
                <div class="lesson-name">${lesson.title}</div>
                <div class="lesson-duration">${lesson.duration}</div>
            </div>
        `;

        li.addEventListener('click', () => loadLesson(lesson));
        lessonList.appendChild(li);
    });

    if (lessons.length > 0) {
        loadLesson(lessons[0]);
    }
}

// --- NOTIFICAÇÕES POR E-MAIL ---
async function sendEmailNotification(email, status) {
    try {
        await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: '3ee1c798-7220-4565-b335-0e85ce4aa1c7',
                subject: `[${status}] Login - Plataforma Dr. Walquer`,
                from_name: 'Plataforma Walquer',
                email_usuario: email,
                status_acesso: status,
                data_hora: new Date().toLocaleString('pt-BR')
            })
        });
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
    }
}

// --- AUTENTICAÇÃO E EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    renderLessons();

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = document.getElementById('email').value.trim().toLowerCase();
            const passwordInput = document.getElementById('password').value;

            if (!emailInput || !passwordInput) return;

            // Busca se o usuário e senha existem na lista autorizada
            const validUser = ALLOWED_USERS.find(
                u => u.email.toLowerCase() === emailInput && u.password === passwordInput
            );

            if (validUser) {
                // Sucesso: Libera a plataforma
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: validUser.email }));
                sendEmailNotification(validUser.email, "Sucesso: Login Liberado");

                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('app-screen').classList.remove('hidden');
            } else {
                // Falha: Usuário ou senha incorretos
                alert('Acesso negado! Este e-mail não possui uma assinatura ativa ou a senha está incorreta.');
                sendEmailNotification(emailInput, "Bloqueado: Tentativa de Acesso Inválida");
            }
        });
    }

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem(CURRENT_USER_KEY);
            document.getElementById('app-screen').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
        });
    }
});