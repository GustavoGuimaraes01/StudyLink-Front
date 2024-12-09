// src/app/services/materiais/endpoints.ts
export const MATERIAL_ENDPOINTS = {
    listar: 'materiais',
    descobrir: 'materiais/descobrir',
    pesquisar: 'materiais/pesquisar',
    adicionar: 'materiais/add',
    atualizar: (id: number) => `materiais/${id}`,
    deletar: (id: number) => `materiais/${id}`,
  };
  