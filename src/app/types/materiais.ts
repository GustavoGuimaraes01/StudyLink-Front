
export interface Material {
    id?: number;
    imagemBanner: string;
    titulo: string;
    areaConhecimento: string;
    visibilidade: string;
  }
  
  export interface MaterialCreateDTO {
    imagemBanner: string;
    titulo: string;
    areaConhecimento: string;
    visibilidade: string;
  }
  
  export interface MaterialReadDTO {
    id?: number;
    imagemBanner: string;
    titulo: string;
    areaConhecimento: string;
    visibilidade: string;
  }
  
  export interface MaterialSearchDTO {
    id?: number;
    imagemBanner: string;
    titulo: string;
    areaConhecimento: string;
    visibilidade: string;
  }