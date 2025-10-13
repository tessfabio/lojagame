// Validação simples do formulário
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const inputs = document.querySelectorAll('.input-padrao');

  // Adiciona classe de erro quando campo está inválido
  inputs.forEach((input) => {
    input.addEventListener('blur', function () {
      if (!this.validity.valid) {
        this.classList.add('erro');
      } else {
        this.classList.remove('erro');
      }
    });
  });

  // Animação suave ao scrollar para links âncora
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Feedback visual ao enviar formulário
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Remova em produção real

      const button = this.querySelector('.enviar');
      if (!button) return; // garante que não quebre se não existir .enviar

      // Para <input type="submit"> use .value; para <button> use .textContent
      const isButtonTag = button.tagName.toLowerCase() === 'button';
      const getText = () => (isButtonTag ? button.textContent : button.value);
      const setText = (txt) => {
        if (isButtonTag) button.textContent = txt;
        else button.value = txt;
      };

      const originalText = getText();

      setText('Enviando...');
      button.disabled = true;

      // Simula envio (remover em produção)
      setTimeout(() => {
        setText('Mensagem Enviada!');
        button.style.background = '#28a745';

        setTimeout(() => {
          setText(originalText);
          button.disabled = false;
          button.style.background = '';
        }, 2000);
      }, 1000);
    });
  }
});


