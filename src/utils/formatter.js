export default {
  role: (text) => ({
    admin: 'Administrador',
    student: 'Estudante',
    professor: 'Professor',
    cleaner: 'Limpeza',
    coordinator: 'Coordenador',
    director: 'Diretor',
    employee: 'Funcionário',
    it: 'Técnico de informática',
    unidentified: 'Sem cadastro'
  })[text],
  action: (id) => ({
    0: 'Acesso negado',
    1: 'Acesso permitido',
    10: 'Usuário deletado',
    11: 'Usuário registrado',
    12: 'Moderador registrado',
    13: 'Admin registrado'
  })[id],
  actionIcon: (id) => ({
    0: 'x',
    1: 'check',
    10: 'trash',
    11: 'plus',
    12: 'plus',
    13: 'plus'
  })[id],
  access: () => ({
    0: 'Sem acesso',
    1: 'Acesso permitido',
    2: 'Moderador',
    3: 'Admin'
  }),
  greet: (date) => {
    const hour = date.getHours()

    if (hour < 4) return 'Boa noite'
    if (hour < 12) return 'Bom dia'
    if (hour < 19) return 'Boa tarde'

    return 'Boa noite'
  }
}
