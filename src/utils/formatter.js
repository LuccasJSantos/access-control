export default {
  role: (text) => ({
    student: 'Estudante',
    professor: 'Professor',
    cleaner: 'Limpeza',
    coordinator: 'Coordenador',
    director: 'Diretor',
    employee: 'Funcionário',
    it: 'Técnico de informática'
  })[text],
  access: () => ({
    0: 'Sem acesso',
    1: 'Acesso permitido',
    2: 'Moderador',
    3: 'Admin'
  }),
}