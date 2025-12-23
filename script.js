document.addEventListener('DOMContentLoaded', function() {
    // Atualizar data no footer
    document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR');
    
    // Elementos DOM
    const albunsContainer = document.getElementById('albuns-container');
    const fotosContainer = document.getElementById('fotos-container');
    const listaAlbunsSection = document.getElementById('lista-albuns');
    const visualizadorAlbumSection = document.getElementById('visualizador-album');
    const voltarListaBtn = document.getElementById('voltar-lista');
    const albumTitulo = document.getElementById('album-titulo');
    const albumDescricao = document.getElementById('album-descricao');
    
    // Carregar lista de álbuns
    carregarAlbuns();
    
    // Evento para voltar à lista de álbuns
    voltarListaBtn.addEventListener('click', function() {
        visualizadorAlbumSection.style.display = 'none';
        listaAlbunsSection.style.display = 'block';
    });
    
    async function carregarAlbuns() {
        try {
            const response = await fetch('albuns.json');
            const data = await response.json();
            
            albunsContainer.innerHTML = '';
            
            data.albuns.forEach(album => {
                const albumCard = document.createElement('div');
                albumCard.className = 'album-card';
                albumCard.innerHTML = `
                    <img src="${album.capa}" alt="${album.nome}" class="album-imagem">
                    <div class="album-info">
                        <h3>${album.nome}</h3>
                        <p class="album-data">${formatarData(album.data)}</p>
                        <p class="album-descricao">${album.descricao}</p>
                        <div class="album-contador">
                            <i class="fas fa-images"></i>
                            <span>${album.quantidade_fotos} fotos</span>
                        </div>
                    </div>
                `;
                
                albumCard.addEventListener('click', () => carregarAlbum(album.id));
                albunsContainer.appendChild(albumCard);
            });
        } catch (error) {
            console.error('Erro ao carregar álbuns:', error);
            albunsContainer.innerHTML = '<p>Erro ao carregar álbuns. Tente novamente mais tarde.</p>';
        }
    }
    
    async function carregarAlbum(albumId) {
        try {
            // Encontrar informações do álbum no albuns.json
            const responseAlbuns = await fetch('albuns.json');
            const dataAlbuns = await responseAlbuns.json();
            const albumInfo = dataAlbuns.albuns.find(a => a.id === albumId);
            
            // Carregar informações específicas do álbum
            const responseAlbum = await fetch(`fotos/album${albumId}/info.json`);
            const dataAlbum = await responseAlbum.json();
            
            // Atualizar interface
            albumTitulo.textContent = albumInfo.nome;
            albumDescricao.textContent = albumInfo.descricao;
            
            // Limpar e preencher fotos
            fotosContainer.innerHTML = '';
            
            dataAlbum.fotos.forEach(foto => {
                const fotoItem = document.createElement('div');
                fotoItem.className = 'foto-item';
                fotoItem.innerHTML = `
                    <img src="fotos/album${albumId}/${foto.arquivo}" alt="${foto.legenda}">
                    <div class="foto-info">
                        <p class="foto-legenda">${foto.legenda}</p>
                        <p class="foto-detalhes">
                            <i class="far fa-calendar"></i> ${formatarData(foto.data)}
                            ${foto.local ? `<br><i class="fas fa-map-marker-alt"></i> ${foto.local}` : ''}
                        </p>
                    </div>
                `;
                fotosContainer.appendChild(fotoItem);
            });
            
            // Mostrar visualizador de álbum
            listaAlbunsSection.style.display = 'none';
            visualizadorAlbumSection.style.display = 'block';
            
        } catch (error) {
            console.error('Erro ao carregar álbum:', error);
            alert('Erro ao carregar álbum. Verifique se os arquivos existem.');
        }
    }
    
    function formatarData(dataString) {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
});
