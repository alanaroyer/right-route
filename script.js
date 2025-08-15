
        function toggleMobileMenu() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobileOverlay');

            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }

        function closeMobileMenu() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobileOverlay');

            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }

        // Navigation
        function showSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });

            // Show selected section
            document.getElementById(sectionId).classList.remove('hidden');

            // Update sidebar active state
            document.querySelectorAll('.sidebar-btn').forEach(btn => {
                btn.classList.remove('sidebar-active');
            });
            event.target.classList.add('sidebar-active');

            // Close mobile menu after selection
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
        }

        // Modal functions
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Notification function
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Data persistence functions
        function saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
                return false;
            }
        }

        function loadFromStorage(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                return null;
            }
        }

        // Passageiro functions
        function editPassageiro(nome) {
            showNotification(`Editando dados de ${nome}`);
        }

        function changeStatus(nome, currentStatus) {
            openModal('changeStatusModal');
            document.getElementById('statusPassageiroNome').textContent = nome;
            document.getElementById('currentStatusInput').value = currentStatus;
            document.getElementById('newStatusSelect').value = currentStatus;
        }

        function saveStatusChange() {
            const nome = document.getElementById('statusPassageiroNome').textContent;
            const newStatus = document.getElementById('newStatusSelect').value;
            const reason = document.getElementById('statusChangeReason').value;

            const statusNames = {
                ativo: 'Ativo',
                inativo: 'Inativo',
                ferias: 'Férias'
            };

            // Load existing passengers data
            let passageiros = loadFromStorage('passageiros') || [];

            // Find and update the passenger
            const passengerIndex = passageiros.findIndex(p => p.nome === nome);
            if (passengerIndex !== -1) {
                passageiros[passengerIndex].status = newStatus;
                passageiros[passengerIndex].lastStatusChange = {
                    date: new Date().toISOString(),
                    reason: reason,
                    previousStatus: document.getElementById('currentStatusInput').value
                };
            } else {
                // If passenger doesn't exist in storage, create a basic record
                passageiros.push({
                    nome: nome,
                    status: newStatus,
                    lastStatusChange: {
                        date: new Date().toISOString(),
                        reason: reason,
                        previousStatus: document.getElementById('currentStatusInput').value
                    }
                });
            }

            // Save updated data
            if (saveToStorage('passageiros', passageiros)) {
                // Update UI to reflect the status change
                updatePassengerStatusInUI(nome, newStatus);
                showNotification(`Status de ${nome} alterado para ${statusNames[newStatus]} e salvo!`);
            } else {
                showNotification('Erro ao salvar alteração de status!');
            }

            closeModal('changeStatusModal');

            // Clear the reason field for next use
            document.getElementById('statusChangeReason').value = '';
        }

        function updatePassengerStatusInUI(nome, newStatus) {
            // Update status in both desktop and mobile views
            const statusClasses = {
                ativo: 'status-ativo',
                inativo: 'status-inativo',
                ferias: 'status-ferias'
            };

            const statusNames = {
                ativo: 'Ativo',
                inativo: 'Inativo',
                ferias: 'Férias'
            };

            // Find all status elements for this passenger
            const rows = document.querySelectorAll('tr, .p-4');
            rows.forEach(row => {
                const nameElement = row.querySelector('.font-medium');
                if (nameElement && nameElement.textContent.trim() === nome) {
                    const statusElement = row.querySelector('span[class*="status-"]');
                    if (statusElement) {
                        // Remove old status classes
                        statusElement.className = statusElement.className.replace(/status-\w+/g, '');
                        // Add new status class
                        statusElement.classList.add(statusClasses[newStatus]);
                        statusElement.textContent = statusNames[newStatus];
                    }
                }
            });
        }

        // Variável global para controlar o número de passageiros
        let passageiroCounter = 1;

        function addPassageiro() {
            passageiroCounter++;
            const passageirosList = document.getElementById('passageirosList');

            const novoPassageiroHTML = `
                <div class="passageiro-item border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                    <div class="flex justify-between items-center mb-3">
                        <h5 class="font-medium text-gray-800">${passageiroCounter}º Passageiro</h5>
                        <button type="button" onclick="removePassageiro(this)" class="text-red-600 hover:text-red-800 p-1" title="Remover passageiro">
                            🗑️
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                            <input type="text" class="passageiro-nome w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Nome completo" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Idade *</label>
                            <input type="number" class="passageiro-idade w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Idade" min="3" max="18" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Escola *</label>
                            <select class="passageiro-escola w-full border border-gray-300 rounded-lg px-4 py-2" required>
                                <option value="">Selecione a escola</option>
                                <option value="erico-verissimo">Érico Veríssimo</option>
                                <option value="arruda">Arruda</option>
                                <option value="piero-sassi">Piero Sassi</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;

            passageirosList.insertAdjacentHTML('beforeend', novoPassageiroHTML);
            updateFinancialSummary();
            showNotification(`${passageiroCounter}º passageiro adicionado!`);
        }

        function removePassageiro(button) {
            if (passageiroCounter <= 1) {
                showNotification('Deve haver pelo menos um passageiro!');
                return;
            }

            button.closest('.passageiro-item').remove();
            passageiroCounter--;

            // Renumerar os passageiros
            const passageiroItems = document.querySelectorAll('.passageiro-item');
            passageiroItems.forEach((item, index) => {
                const numero = index + 1;
                const titulo = item.querySelector('h5');
                titulo.textContent = `${numero}º Passageiro`;
            });

            updateFinancialSummary();
            showNotification('Passageiro removido!');
        }

        function updateFinancialSummary() {
            const valorBaseInput = document.getElementById('valorBaseMensalidade');
            const valorBase = parseFloat(valorBaseInput.value.replace(/[R$\s]/g, '').replace(',', '.')) || 0;

            // Valor total = valor base × número de passageiros
            const valorTotal = valorBase * passageiroCounter;

            // Atualizar interface
            document.getElementById('totalPassageiros').textContent = passageiroCounter;
            document.getElementById('valorTotalMensal').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        }

        function savePassageiroFamily() {
            event.preventDefault();

            // Validar dados do responsável
            const nomeResponsavel = document.getElementById('nomeResponsavel').value;
            const telefone = document.getElementById('telefoneResponsavel').value;
            const endereco = document.getElementById('enderecoResponsavel').value;
            const bairro = document.getElementById('bairroResponsavel').value;
            const valorBase = document.getElementById('valorBaseMensalidade').value;

            if (!nomeResponsavel || !telefone || !endereco || !bairro || !valorBase) {
                showNotification('Por favor, preencha todos os dados do responsável!');
                return;
            }

            // Coletar dados dos passageiros
            const passageiroItems = document.querySelectorAll('.passageiro-item');
            const passageiros = [];
            let familyId = Date.now(); // ID único para a família

            for (let i = 0; i < passageiroItems.length; i++) {
                const item = passageiroItems[i];
                const nome = item.querySelector('.passageiro-nome').value;
                const idade = item.querySelector('.passageiro-idade').value;
                const escola = item.querySelector('.passageiro-escola').value;

                if (!nome || !idade || !escola) {
                    showNotification(`Por favor, preencha todos os dados do ${i + 1}º passageiro!`);
                    return;
                }

                // Valor individual igual para todos
                const valorBaseNum = parseFloat(valorBase.replace(/[R$\s]/g, '').replace(',', '.'));

                const passageiro = {
                    id: familyId + i, // ID único baseado na família
                    familyId: familyId,
                    nome: nome,
                    idade: parseInt(idade),
                    escola: escola,
                    responsavel: {
                        nome: nomeResponsavel,
                        telefone: telefone
                    },
                    endereco: endereco,
                    bairro: bairro,
                    mensalidade: `R$ ${valorBaseNum.toFixed(2).replace('.', ',')}`,
                    valorOriginal: valorBase,
                    posicaoFamilia: i + 1,
                    totalPassageiros: passageiroCounter,
                    status: 'ativo',
                    dataCadastro: new Date().toISOString(),
                    pagamentos: []
                };

                passageiros.push(passageiro);
            }

            // Salvar no localStorage
            let passageirosExistentes = loadFromStorage('passageiros') || [];
            passageirosExistentes.push(...passageiros);

            if (saveToStorage('passageiros', passageirosExistentes)) {
                // Limpar formulário
                document.getElementById('nomeResponsavel').value = '';
                document.getElementById('telefoneResponsavel').value = '';
                document.getElementById('enderecoResponsavel').value = '';
                document.getElementById('bairroResponsavel').value = '';
                document.getElementById('valorBaseMensalidade').value = '';

                // Resetar lista de passageiros
                const passageirosList = document.getElementById('passageirosList');
                passageirosList.innerHTML = `
                    <div class="passageiro-item border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                        <div class="flex justify-between items-center mb-3">
                            <h5 class="font-medium text-gray-800">1º Passageiro</h5>
                            <span class="text-sm text-green-600 font-medium">Valor integral</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                                <input type="text" class="passageiro-nome w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Nome completo" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Idade *</label>
                                <input type="number" class="passageiro-idade w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Idade" min="3" max="18" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Escola *</label>
                                <select class="passageiro-escola w-full border border-gray-300 rounded-lg px-4 py-2" required>
                                    <option value="">Selecione a escola</option>
                                    <option value="escola-municipal">Escola Municipal</option>
                                    <option value="colegio-sao-jose">Colégio São José</option>
                                    <option value="escola-estadual">Escola Estadual</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `;

                passageiroCounter = 1;
                updateFinancialSummary();
                updateDashboardStats();

                closeModal('novoPassageiro');

                const totalPassageiros = passageiros.length;
                const valorIndividual = parseFloat(valorBase.replace(/[R$\s]/g, '').replace(',', '.'));
                const valorTotalFamilia = valorIndividual * totalPassageiros;

                showNotification(`Família cadastrada! ${totalPassageiros} passageiro(s) - Total: R$ ${valorTotalFamilia.toFixed(2).replace('.', ',')}`);
            } else {
                showNotification('Erro ao salvar família!');
            }
        }

        // Atualizar resumo financeiro quando o valor base mudar
        document.addEventListener('DOMContentLoaded', function () {
            const valorBaseInput = document.getElementById('valorBaseMensalidade');
            if (valorBaseInput) {
                valorBaseInput.addEventListener('input', updateFinancialSummary);
            }
        });

        function addPassengerToUI(passageiro) {
            // This would add the passenger to the table/list in real-time
            // For now, we'll just update the stats and show success
            console.log('Passageiro adicionado:', passageiro);
        }

        function updateDashboardStats() {
            const passageiros = loadFromStorage('passageiros') || [];
            const totalPassageiros = passageiros.length;
            const receitaMensal = passageiros.reduce((total, p) => {
                const valor = parseFloat(p.mensalidade.replace(/[R$\s]/g, '').replace(',', '.')) || 0;
                return total + valor;
            }, 0);

            // Calcular passageiros ativos
            const passageirosAtivos = passageiros.filter(p => p.status === 'ativo').length;

            // Update dashboard numbers using specific IDs
            const totalPassageirosDash = document.getElementById('totalPassageirosDash');
            const receitaMensalDash = document.getElementById('receitaMensalDash');
            const passageirosAtivosDash = document.getElementById('passageirosAtivosDash');

            if (totalPassageirosDash) totalPassageirosDash.textContent = totalPassageiros;
            if (receitaMensalDash) receitaMensalDash.textContent = `R$ ${receitaMensal.toFixed(2).replace('.', ',')}`;
            if (passageirosAtivosDash) passageirosAtivosDash.textContent = passageirosAtivos;
        }

        // Financial functions
        function generateRecibo(nome) {
            showNotification(`Gerando recibo para ${nome}`);
        }

        function sendReminder(nome) {
            showNotification(`Enviando lembrete via WhatsApp para ${nome}`);
        }

        function sendCobranca(nome) {
            showNotification(`Enviando cobrança via WhatsApp para ${nome}`);
        }

        function savePagamento() {
            event.preventDefault();
            closeModal('registrarPagamento');
            showNotification('Pagamento registrado com sucesso!');
        }

        // WhatsApp Business functions
        function testConnection() {
            showNotification('Testando conexão com WhatsApp Business API...');

            // Simulate connection test
            setTimeout(() => {
                showNotification('✅ Conexão testada com sucesso! API respondendo normalmente.');
            }, 2000);
        }

        function saveConnection() {
            const phoneNumber = document.querySelector('input[type="tel"]').value;
            const token = document.querySelector('input[type="password"]').value;
            const webhook = document.querySelector('input[type="url"]').value;

            if (!phoneNumber || !token || !webhook) {
                showNotification('❌ Preencha todos os campos obrigatórios!');
                return;
            }

            // Simulate saving connection settings
            localStorage.setItem('whatsappConfig', JSON.stringify({
                phone: phoneNumber,
                token: token.substring(0, 4) + '••••••••••••',
                webhook: webhook,
                lastUpdated: new Date().toISOString()
            }));

            showNotification('✅ Configurações do WhatsApp Business salvas com sucesso!');
        }

        function configureAutomation() {
            showNotification('Abrindo configurações avançadas de automação...');
            // Here you would open a detailed automation configuration modal
        }

        function manageTemplate(templateType) {
            const templateNames = {
                welcome: 'Boas-vindas',
                reminder: 'Lembrete de Vencimento',
                overdue: 'Cobrança de Atraso',
                receipt: 'Confirmação de Pagamento',
                holiday: 'Aviso de Férias'
            };

            showNotification(`Editando template: ${templateNames[templateType]}`);
            // Here you would open a template editor modal
        }

        function createNewTemplate() {
            showNotification('Criando novo template de mensagem...');
            // Here you would open a new template creation modal
        }

        function viewDetailedAnalytics() {
            showNotification('Carregando relatório detalhado de analytics...');
            // Here you would show detailed analytics dashboard
        }

        function editTemplate(tipo) {
            showNotification(`Editando modelo de ${tipo}`);
        }

        function sendBulkMessage() {
            showNotification('Mensagens enviadas via WhatsApp!');
        }

        // Filter functions
        function applyFilters() {
            const statusFilter = document.getElementById('statusFilter').value;
            const escolaFilter = document.getElementById('escolaFilter').value;
            const bairroFilter = document.getElementById('bairroFilter').value;
            const searchInput = document.getElementById('searchInput').value.toLowerCase();

            // Simulate filtering logic
            let resultCount = 3; // Default showing all

            if (statusFilter || escolaFilter || bairroFilter || searchInput) {
                // Simulate filtered results
                if (escolaFilter === 'escola-municipal') resultCount = 1;
                else if (escolaFilter === 'colegio-sao-jose') resultCount = 1;
                else if (escolaFilter === 'escola-estadual') resultCount = 1;
                else if (statusFilter === 'ativo') resultCount = 2;
                else if (statusFilter === 'ferias') resultCount = 1;
                else if (bairroFilter === 'centro') resultCount = 1;
                else if (bairroFilter === 'jardim-america') resultCount = 1;
                else if (searchInput) resultCount = searchInput.length > 0 ? 1 : 3;
            }

            document.getElementById('resultCount').textContent = resultCount;
            document.getElementById('filterResults').classList.remove('hidden');

            showNotification(`Filtros aplicados! ${resultCount} passageiros encontrados.`);
        }

        function clearFilters() {
            document.getElementById('statusFilter').value = '';
            document.getElementById('escolaFilter').value = '';
            document.getElementById('bairroFilter').value = '';
            document.getElementById('searchInput').value = '';
            document.getElementById('filterResults').classList.add('hidden');

            showNotification('Filtros limpos! Mostrando todos os passageiros.');
        }

        function exportFilteredData() {
            const statusFilter = document.getElementById('statusFilter').value;
            const escolaFilter = document.getElementById('escolaFilter').value;

            const data = {
                filtros: {
                    status: statusFilter,
                    escola: escolaFilter,
                    timestamp: new Date().toISOString()
                },
                passageiros: [
                    { nome: 'Ana Silva', escola: 'Escola Municipal', status: 'Ativo' },
                    { nome: 'Carlos Santos', escola: 'Colégio São José', status: 'Férias' },
                    { nome: 'Maria Oliveira', escola: 'Escola Estadual', status: 'Ativo' }
                ]
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `passageiros-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            showNotification('Dados exportados com sucesso!');
        }

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function (e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking overlay
        document.getElementById('mobileOverlay').addEventListener('click', closeMobileMenu);

        // Handle window resize
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1024) {
                closeMobileMenu();
            }
        });

        // Theme functions
        let isDarkMode = localStorage.getItem('darkMode') === 'true';

        function toggleTheme() {
            isDarkMode = !isDarkMode;
            applyTheme();
            localStorage.setItem('darkMode', isDarkMode);
            showNotification(isDarkMode ? 'Modo escuro ativado!' : 'Modo claro ativado!');
        }

        function applyTheme() {
            const body = document.body;
            const toggles = document.querySelectorAll('.theme-toggle');
            const toggleIcons = document.querySelectorAll('.toggle-icon');
            const toggleCircles = document.querySelectorAll('.toggle-circle span');

            if (isDarkMode) {
                body.classList.add('dark');
                toggles.forEach(toggle => toggle.classList.add('dark'));
                toggleIcons.forEach(icon => icon.textContent = '☀️');
                toggleCircles.forEach(circle => circle.textContent = '☀️');
            } else {
                body.classList.remove('dark');
                toggles.forEach(toggle => toggle.classList.remove('dark'));
                toggleIcons.forEach(icon => icon.textContent = '🌙');
                toggleCircles.forEach(circle => circle.textContent = '🌙');
            }
        }

        // Refresh function
        function refreshApp() {
            showNotification('Atualizando aplicativo...');

            // Simulate refresh with loading animation
            const refreshBtn = event.target;
            refreshBtn.style.animation = 'spin 1s linear infinite';

            setTimeout(() => {
                refreshBtn.style.animation = '';
                showNotification('Aplicativo atualizado com sucesso!');

                // Refresh data (simulate)
                updateDashboardData();
            }, 2000);
        }

        function updateDashboardData() {
            // Simulate data refresh
            const stats = document.querySelectorAll('.text-3xl.font-bold');
            stats.forEach(stat => {
                if (stat.textContent.includes('R$')) {
                    // Simulate small changes in financial data
                    const currentValue = parseFloat(stat.textContent.replace(/[R$\s.]/g, '').replace(',', '.'));
                    const newValue = currentValue + (Math.random() - 0.5) * 100;
                    stat.textContent = `R$ ${newValue.toFixed(2).replace('.', ',')}`;
                }
            });
        }

        // Settings functions
        function exportData() {
            const data = {
                passageiros: ['Ana Silva', 'Carlos Santos', 'Maria Oliveira'],
                configuracoes: { darkMode: isDarkMode },
                timestamp: new Date().toISOString()
            };

            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            // Create download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `rota-certa-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            showNotification('Dados exportados com sucesso!');
        }

        function importData() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = function (e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        try {
                            const data = JSON.parse(e.target.result);
                            // Process imported data
                            if (data.configuracoes && data.configuracoes.darkMode !== undefined) {
                                isDarkMode = data.configuracoes.darkMode;
                                applyTheme();
                            }
                            showNotification('Dados importados com sucesso!');
                        } catch (error) {
                            showNotification('Erro ao importar dados. Arquivo inválido.');
                        }
                    };
                    reader.readAsText(file);
                }
            };
            input.click();
        }

        function clearAllData() {
            if (confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema!\n\nTodos os passageiros, pagamentos e configurações serão perdidos permanentemente.\n\nDeseja realmente continuar?')) {
                if (confirm('Última confirmação: Tem certeza absoluta que deseja apagar todos os dados?')) {
                    localStorage.clear();
                    showNotification('Todos os dados foram apagados!');
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            }
        }

        // Theme color is fixed to blue

        function applySettings() {
            showNotification('Aplicando todas as configurações...');

            setTimeout(() => {
                showNotification('Configurações aplicadas com sucesso!');

                // Save all settings to localStorage
                const settings = {
                    notifications: {
                        vencimento: document.querySelector('input[type="checkbox"]').checked,
                        pagamentos: document.querySelectorAll('input[type="checkbox"]')[1].checked,
                        novosPassageiros: document.querySelectorAll('input[type="checkbox"]')[2].checked
                    }
                };

                localStorage.setItem('rotaCertaSettings', JSON.stringify(settings));
            }, 1500);
        }

        // Initialize app and load saved data on page load
        document.addEventListener('DOMContentLoaded', function () {
            // Load saved dark mode preference
            const savedDarkMode = loadFromStorage('darkMode');
            if (savedDarkMode !== null) {
                isDarkMode = savedDarkMode;
            }

            applyTheme();

            // Load and update dashboard stats
            updateDashboardStats();

            // Load other saved settings
            loadSavedSettings();
        });

        function loadSavedSettings() {
            // Load WhatsApp configuration
            const whatsappConfig = loadFromStorage('whatsappConfig');
            if (whatsappConfig) {
                const phoneInput = document.querySelector('input[type="tel"]');
                const tokenInput = document.querySelector('input[type="password"]');
                const webhookInput = document.querySelector('input[type="url"]');

                if (phoneInput) phoneInput.value = whatsappConfig.phone || '';
                if (tokenInput) tokenInput.value = whatsappConfig.token || '';
                if (webhookInput) webhookInput.value = whatsappConfig.webhook || '';
            }

            // Load other settings as needed
            const rotaCertaSettings = loadFromStorage('rotaCertaSettings');
            if (rotaCertaSettings) {
                // Apply notification settings
                const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                if (rotaCertaSettings.notifications) {
                    if (checkboxes[0]) checkboxes[0].checked = rotaCertaSettings.notifications.vencimento;
                    if (checkboxes[1]) checkboxes[1].checked = rotaCertaSettings.notifications.pagamentos;
                    if (checkboxes[2]) checkboxes[2].checked = rotaCertaSettings.notifications.novosPassageiros;
                }
            }
        }

        // Add CSS animation for refresh button
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    