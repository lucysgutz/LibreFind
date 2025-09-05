document.addEventListener('DOMContentLoaded', () => {

    const style = document.createElement('style');
    style.textContent = `

        body.cookie-modal-open > *:not(#cookie-modal) {
            filter: blur(5px);
            pointer-events: none;
            user-select: none;
        }

        #cookie-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.95);
            color: #111;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
            font-family: Arial, sans-serif;
            text-align: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.4s ease;
        }

        #cookie-modal.show {
            opacity: 1;
        }

        #cookie-modal h2 {
            margin-bottom: 1rem;
        }

        #cookie-modal p {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
        }

        #cookie-modal button {
            padding: 0.5rem 1rem;
            margin: 0 0.5rem;
            border-radius: 6px;
            border: none;
            font-size: 0.9rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        #cookie-accept {
            background-color: #28a745;
            color: #fff;
        }

        #cookie-accept:hover {
            background-color: #218838;
        }

        #cookie-reject {
            background-color: #dc3545;
            color: #fff;
        }

        #cookie-reject:hover {
            background-color: #b02a37;
        }

        #cookie-modal a {
            color: #007BFF;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

 
    const modal = document.createElement('div');
    modal.id = 'cookie-modal';
    modal.innerHTML = `
        <h2>Cookies</h2>
        <p>We use cookies to improve your experience</p>
        <button id="cookie-accept">Accept</button>
        <button id="cookie-reject">Reject</button>
    `;
    document.body.appendChild(modal);

    const acceptBtn = modal.querySelector('#cookie-accept');
    const rejectBtn = modal.querySelector('#cookie-reject');

    const consent = localStorage.getItem('cookieConsent');

    if (!consent) {

        modal.classList.add('show');
        document.body.classList.add('cookie-modal-open');
    } else {
        applyConsent(consent);
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        applyConsent('accepted');
        closeModal();
    });

    rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        applyConsent('rejected');
        closeModal();
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.classList.remove('cookie-modal-open');
    }

    function applyConsent(value) {
        if (value === 'accepted') {
            console.log('Cookies accepted: trackers/ads can load.');

        } else {
            console.log('Cookies rejected: no trackers loaded.');

        }
    }
});
