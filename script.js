 // Mobile menu functions
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
                // A LINHA ABAIXO SERÁ SUBSTITUÍDA
                // updatePassengerStatusInUI(nome, newStatus);  
            renderPassageiros();
            updateDashboardStats();   
            showNotification(`Status de ${nome} alterado para ${statusNames[newStatus]} e salvo!`);
            }
            else {
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

        function addIrmao() {
            passageiroCounter++;
            const passageirosList = document.getElementById('passageirosList');

            // Calcular desconto
            let desconto = '';
            let descontoTexto = '';
            if (passageiroCounter === 2) {
                desconto = '15%';
                descontoTexto = '15% de desconto';
            } else if (passageiroCounter >= 3) {
                desconto = '25%';
                descontoTexto = '25% de desconto';
            }

            const novoPassageiroHTML = `
                <div class="passageiro-item border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                    <div class="flex justify-between items-center mb-3">
                        <h5 class="font-medium text-gray-800">${passageiroCounter}º Passageiro</h5>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-orange-600 font-medium">${descontoTexto}</span>
                            <button type="button" onclick="removeIrmao(this)" class="text-red-600 hover:text-red-800 p-1" title="Remover passageiro">
                                🗑️
                            </button>
                        </div>
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

            passageirosList.insertAdjacentHTML('beforeend', novoPassageiroHTML);
            updateFinancialSummary();
            showNotification(`${passageiroCounter}º irmão adicionado com ${descontoTexto}!`);
        }

        function removeIrmao(button) {
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

                // Atualizar desconto
                const descontoSpan = item.querySelector('.text-orange-600, .text-green-600');
                if (numero === 1) {
                    descontoSpan.textContent = 'Valor integral';
                    descontoSpan.className = 'text-sm text-green-600 font-medium';
                } else if (numero === 2) {
                    descontoSpan.textContent = '15% de desconto';
                    descontoSpan.className = 'text-sm text-orange-600 font-medium';
                } else {
                    descontoSpan.textContent = '25% de desconto';
                    descontoSpan.className = 'text-sm text-orange-600 font-medium';
                }
            });

            updateFinancialSummary();
            showNotification('Passageiro removido!');
        }

        function updateFinancialSummary() {
            const valorBaseInput = document.getElementById('valorBaseMensalidade');
            const valorBase = parseFloat(valorBaseInput.value.replace(/[R$\s]/g, '').replace(',', '.')) || 0;

            let valorTotal = 0;
            let descontoTotal = 0;

            // Calcular valores com desconto
            for (let i = 1; i <= passageiroCounter; i++) {
                if (i === 1) {
                    valorTotal += valorBase; // Valor integral
                } else if (i === 2) {
                    const valorComDesconto = valorBase * 0.85; // 15% desconto
                    valorTotal += valorComDesconto;
                    descontoTotal += valorBase - valorComDesconto;
                } else {
                    const valorComDesconto = valorBase * 0.75; // 25% desconto
                    valorTotal += valorComDesconto;
                    descontoTotal += valorBase - valorComDesconto;
                }
            }

            // Atualizar interface
            document.getElementById('totalPassageiros').textContent = passageiroCounter;
            document.getElementById('descontoAplicado').textContent = `R$ ${descontoTotal.toFixed(2).replace('.', ',')}`;
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

                // Calcular valor individual
                const valorBaseNum = parseFloat(valorBase.replace(/[R$\s]/g, '').replace(',', '.'));
                let valorIndividual = valorBaseNum;

                if (i === 1) { // 2º filho
                    valorIndividual = valorBaseNum * 0.85;
                } else if (i >= 2) { // 3º filho em diante
                    valorIndividual = valorBaseNum * 0.75;
                }

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
                    mensalidade: `R$ ${valorIndividual.toFixed(2).replace('.', ',')}`,
                    valorOriginal: valorBase,
                    desconto: i === 0 ? 0 : (i === 1 ? 15 : 25),
                    posicaoFamilia: i + 1,
                    totalIrmaos: passageiroCounter,
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

                passageiroCounter = 1;
                updateFinancialSummary();
                updateDashboardStats(); // <-- Esta já atualiza o dashboard
                
                // >>> ADICIONE ESTA LINHA ABAIXO <<<
                renderPassageiros(); // Atualiza a lista de passageiros na tela
                closeModal('novoPassageiro');
                
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
                const valorTotalFamilia = passageiros.reduce((total, p) => {
                    return total + parseFloat(p.mensalidade.replace(/[R$\s]/g, '').replace(',', '.'));
                }, 0);

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
            const toggleCircles = document.querySelectorAll('.toggle-circle span');

            if (isDarkMode) {
                body.classList.add('dark');
                toggles.forEach(toggle => toggle.classList.add('dark'));
                toggleCircles.forEach(circle => circle.textContent = '☀️');
            } else {
                body.classList.remove('dark');
                toggles.forEach(toggle => toggle.classList.remove('dark'));
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


            // Update active sidebar color
            const activeBtn = document.querySelector('.sidebar-active');
            if (activeBtn) {
                activeBtn.style.backgroundColor = colorMap[color];
            }

            // Update color selection border
            document.querySelectorAll('[onclick*="changeThemeColor"]').forEach(btn => {
                btn.classList.remove('border-blue-800', 'border-green-800', 'border-red-800', 'border-yellow-700');
                btn.classList.add('border-transparent');
            });

            const selectedBtn = document.querySelector(`[onclick="changeThemeColor('${color}')"]`);
            if (selectedBtn) {
                selectedBtn.classList.remove('border-transparent');
                if (color === 'yellow') {
                    selectedBtn.classList.add('border-yellow-700');
                } else {
                    selectedBtn.classList.add(`border-${color}-800`);
                }
            }

            // Save to storage
            saveToStorage('themeColor', color);
            showNotification(`Tema alterado para ${colorNames[color]} e salvo!`);

        function applySettings() {
            showNotification('Aplicando todas as configurações...');

            setTimeout(() => {
                showNotification('Configurações aplicadas com sucesso!');

                // Save all settings to localStorage
                const settings = {
                    darkMode: isDarkMode,
                    notifications: {
                        vencimento: document.querySelector('input[type="checkbox"]').checked,
                        pagamentos: document.querySelectorAll('input[type="checkbox"]')[1].checked,
                        novosPassageiros: document.querySelectorAll('input[type="checkbox"]')[2].checked
                    }
                };

                localStorage.setItem('rotaCertaSettings', JSON.stringify(settings));
            }, 1500);
        }

        // Initialize theme and load saved data on page load
        document.addEventListener('DOMContentLoaded', function () {
            // Load saved theme
            const savedThemeColor = loadFromStorage('themeColor');
            if (savedThemeColor) {
                changeThemeColor(savedThemeColor);
            }

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
            
            // Load and update dashboard stats
        updateDashboardStats();
        
        // >>> ADICIONE ESTA LINHA ABAIXO <<<
        renderPassageiros(); // Desenha a lista de passageiros na tela

        // Load other saved settings
        loadSavedSettings();

        // Add CSS animation for refresh button
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
document.head.appendChild(style);
        function renderPassageiros() {
    const passageiros = loadFromStorage('passageiros') || [];
    const tableBody = document.getElementById('passageirosTableBody');
    const cardContainer = document.getElementById('passageirosCardContainer');

    // Limpa o conteúdo atual para não duplicar
    tableBody.innerHTML = '';
    cardContainer.innerHTML = '';

    if (passageiros.length === 0) {
        // Mensagem para quando não há passageiros
        const emptyRow = `<tr><td colspan="6" class="text-center py-10 text-gray-500">Nenhum passageiro cadastrado ainda.</td></tr>`;
        const emptyCard = `<div class="p-6 text-center text-gray-500">Nenhum passageiro cadastrado ainda.</div>`;
        tableBody.innerHTML = emptyRow;
        cardContainer.innerHTML = emptyCard;
        return;
    }

    passageiros.forEach(p => {
        // Define as classes de cor para o status
        const statusClasses = {
            ativo: 'status-ativo',
            inativo: 'status-inativo',
            ferias: 'status-ferias'
        };
        const statusText = {
            ativo: 'Ativo',
            inativo: 'Inativo',
            ferias: 'Férias'
        };

        const statusClass = statusClasses[p.status] || 'bg-gray-400';
        const statusName = statusText[p.status] || 'Desconhecido';
        const iniciais = p.nome.split(' ').map(n => n[0]).slice(0, 2).join('');

        // HTML para a linha da tabela (Desktop)
        const rowHTML = `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-semibold">${iniciais}</span>
                        </div>
                        <div>
                            <p class="font-medium">${p.nome}</p>
                            <p class="text-sm text-gray-500">${p.idade} anos</p>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <p class="font-medium">${p.responsavel.nome}</p>
                    <p class="text-sm text-gray-500">${p.responsavel.telefone}</p>
                </td>
                <td class="px-6 py-4">${p.escola}</td>
                <td class="px-6 py-4">
                    <span class="${statusClass} text-white px-3 py-1 rounded-full text-sm">${statusName}</span>
                </td>
                <td class="px-6 py-4">${p.mensalidade}</td>
                <td class="px-6 py-4">
                    <div class="flex space-x-2">
                        <button onclick="editPassageiro('${p.nome}')" class="text-green-600 hover:text-green-800" title="Editar">✏️</button>
                        <button onclick="changeStatus('${p.nome}', '${p.status}')" class="text-orange-600 hover:text-orange-800" title="Alterar Status">🔄</button>
                    </div>
                </td>
            </tr>
        `;

        // HTML para o cartão (Mobile)
        const cardHTML = `
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-semibold">${iniciais}</span>
                        </div>
                        <div>
                            <p class="font-medium">${p.nome}</p>
                            <p class="text-sm text-gray-500">${p.idade} anos</p>
                        </div>
                    </div>
                    <span class="${statusClass} text-white px-3 py-1 rounded-full text-sm">${statusName}</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                        <p class="text-gray-500">Responsável:</p>
                        <p class="font-medium">${p.responsavel.nome}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Mensalidade:</p>
                        <p class="font-medium">${p.mensalidade}</p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-sm text-gray-500">${p.escola}</p>
                    <div class="flex space-x-3">
                        <button onclick="editPassageiro('${p.nome}')" class="text-green-600" title="Editar">✏️</button>
                        <button onclick="changeStatus('${p.nome}', '${p.status}')" class="text-orange-600" title="Alterar Status">🔄</button>
                    </div>
                </div>
            </div>
        `;

        tableBody.innerHTML += rowHTML;
        cardContainer.innerHTML += cardHTML;
    });
}