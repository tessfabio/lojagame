/* === MAPA INTERATIVO COM LEAFLET.JS — VERSÃO SIMPLIFICADA PARA APENAS UMA UNIDADE === */

/* === UNIDADE FIXA === */
const unidade = {
    id: 'unidade1',
    nome: 'The GameHub - Cascavel',
    lat: -24.9800313,
    lng: -53.5063787,
    endereco: 'Rua Jade, 251<br>Cascavel - PR',
    telefone: '+550000000000',
    horario: 'Seg-Sex: 9h às 18h | Sáb: 9h às 13h',
    descricao: 'Nossa unidade principal em Cascavel.'
};

class MapaInterativo {
    constructor() {
        // Elementos do DOM
        this.mapaElement = document.getElementById('mapa');
        this.btnMinhaLocalizacao = document.getElementById('btnMinhaLocalizacao');
        this.btnCalcularRota = document.getElementById('btnCalcularRota');
        this.btnCompartilhar = document.getElementById('btnCompartilhar');
        this.tipoMapa = document.getElementById('tipoMapa');
        this.infoPanel = document.getElementById('infoPanel');
        this.fecharPanel = document.getElementById('fecharPanel');

        // Variáveis
        this.mapa = null;
        this.marcadorUnidade = null;
        this.minhaLocalizacao = null;
        this.marcadorUsuario = null;

        // Camadas
        this.camadasMapa = {
            streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '© Esri' }),
            terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenTopoMap' })
        };

        this.init();
    }

    /* === INICIALIZAÇÃO === */
    init() {
        if (!L) {
            alert("Erro ao carregar o mapa.");
            return;
        }

        // Criar mapa centralizado diretamente na unidade
        this.mapa = L.map('mapa').setView([unidade.lat, unidade.lng], 17);
        this.camadasMapa.streets.addTo(this.mapa);

        this.adicionarMarcadorUnico();
        this.configurarEventos();

        console.log("Mapa carregado!");
    }

    /* === MARCADOR ÚNICO === */
    adicionarMarcadorUnico() {
        const icon = L.divIcon({
            className: 'custom-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        this.marcadorUnidade = L.marker([unidade.lat, unidade.lng], { icon })
            .addTo(this.mapa)
            .bindPopup(`
                <strong>${unidade.nome}</strong><br>
                ${unidade.endereco}<br>
                <em>${unidade.horario}</em><br><br>
                <a href="tel:${unidade.telefone}" style="background:#28a745;color:#fff;padding:6px 12px;border-radius:10px;text-decoration:none;">📞 Ligar</a>
            `);

        this.marcadorUnidade.openPopup();
    }

    /* === EVENTOS === */
    configurarEventos() {
        if (this.btnMinhaLocalizacao) {
            this.btnMinhaLocalizacao.addEventListener('click', () => this.obterMinhaLocalizacao());
        }

        if (this.btnCalcularRota) {
            this.btnCalcularRota.addEventListener('click', () => this.calcularRota());
        }

        if (this.btnCompartilhar) {
            this.btnCompartilhar.addEventListener('click', () => this.compartilharLocalizacao());
        }

        if (this.tipoMapa) {
            this.tipoMapa.addEventListener('change', (e) => {
                this.trocarTipoMapa(e.target.value);
            });
        }

        if (this.fecharPanel) {
            this.fecharPanel.addEventListener('click', () => {
                this.infoPanel.classList.remove('show');
            });
        }
    }

    /* === MINHA LOCALIZAÇÃO === */
    obterMinhaLocalizacao() {
        if (!navigator.geolocation) {
            alert("Seu navegador não permite localizar.");
            return;
        }

        this.btnMinhaLocalizacao.disabled = true;
        this.btnMinhaLocalizacao.textContent = "Localizando...";

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                this.minhaLocalizacao = { lat, lng };

                if (this.marcadorUsuario) this.mapa.removeLayer(this.marcadorUsuario);

                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div style="background:#28a745;width:20px;height:20px;border-radius:50%;border:3px solid white;"></div>',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                this.marcadorUsuario = L.marker([lat, lng], { icon: userIcon }).addTo(this.mapa);
                this.marcadorUsuario.bindPopup("Você está aqui!").openPopup();
                this.mapa.setView([lat, lng], 16);

                this.btnMinhaLocalizacao.disabled = false;
                this.btnMinhaLocalizacao.textContent = "Minha Localização";
            },
            () => {
                alert("Não foi possível obter sua localização.");
                this.btnMinhaLocalizacao.disabled = false;
                this.btnMinhaLocalizacao.textContent = "Minha Localização";
            }
        );
    }

    /* === ROTA === */
    calcularRota() {
        if (!this.minhaLocalizacao) {
            alert("Primeiro clique em 'Minha Localização'");
            return;
        }

        const origem = `${this.minhaLocalizacao.lat},${this.minhaLocalizacao.lng}`;
        const destino = `${unidade.lat},${unidade.lng}`;

        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}`, "_blank");
    }

    /* === COMPARTILHAR === */
    compartilharLocalizacao() {
        const url = `https://www.google.com/maps?q=${unidade.lat},${unidade.lng}`;
        const texto = `${unidade.nome} - Rua Jade, 251, Cascavel-PR\n${url}`;

        if (navigator.share) {
            navigator.share({ title: unidade.nome, text: texto, url });
        } else {
            navigator.clipboard.writeText(texto);
            alert("Link copiado!");
        }
    }

    /* === TROCAR TIPO DE MAPA === */
    trocarTipoMapa(tipo) {
        Object.values(this.camadasMapa).forEach(c => this.mapa.removeLayer(c));
        this.camadasMapa[tipo].addTo(this.mapa);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.mapa = new MapaInterativo();
});
