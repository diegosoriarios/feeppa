const Ferramenta = {
  cod: Int,
  nome: String,
  link: String,
  imagem: String,
}

const Contribuicao = {
  cod: Int,
  usuario: Usuario.cod,
  ferramenta: Ferramenta.cod,
  tipo: String,
  titulo: String,
  aprovada: Boolean | null,
  rejeitada: Boolean | null,
  motivo: String,
}

const Usuario = {
  cod: Int,
  instituicao: Instituicao.cod,
  nome: String,
  senha: String,
  email: String,
  username: String,
  papelCurador: Boolean,
  avatar: String | null,
  frequenciaEmail: Int,
}

const Instituicao = {
  cod: Int,
  descricao: String,
  logo: String | null
}

const Selo = {
  usuario: Usuario.cod,
  id: Int,
  imagem: String
}

const Pontuacao = {
  data: Date,
  cod: Int,
  usuario: Usuario.cod,
  numPontos: Int,
  contribuicao: Int,
  ferramenta: Ferramenta.cod,
}

const ContribuicaoDuvida = {
  contribuicao: Contribuicao.cod,
  usuario: Usuario.cod,
  ferramenta: Ferramenta.cod,
  resposta: ContribuicaoResposta.cod,
  descricaoDuvida: String,
  videoDuvida: String | null,
}

const ContribuicaoResposta = {
  cod: Int,
  contribuicao: Contribuicao.cod,
  usuario: Usuario.cod,
  ferramenta: Ferramenta.cod,
  descricaoResposta: String,
  arquivoResposta: String | null,
  videoResposta: String | null,
}

const ContribuicaoContribuicao = {
  cod: Int,
  contribuicao: Contribuicao.cod,
  usuario: Usuario.cod,
  ferramenta: Ferramenta.cod,
  tipoContribuicao: String,
  descricaoContribuicao: String,
  linkContribuicao: String | null,
  arquivoContribuicao: String | null,
}

const PassoResposta = {
  cod: Int,
  resposta: ContribuicaoResposta.cod,
  contribuicao: Contribuicao.cod,
  usuario: Usuario.cod,
  ferramenta: Ferramenta.cod,
}

