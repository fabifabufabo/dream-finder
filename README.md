# Dream Finder API

## Sobre

API para busca de vagas de emprego em múltiplas plataformas (Gupy e Solides).

## Como usar

### Iniciar o servidor

```bash
npm run server
```

### Endpoint disponível

#### GET /jobs

Busca vagas de emprego com base nos parâmetros fornecidos.

**Parâmetros de consulta (query parameters):**

- `jobSearchTerms` - Termos de busca separados por vírgula (opcional, usa config padrão se não fornecido)
- `enableRemote` - true/false para habilitar vagas remotas (padrão: true)
- `platforms` - Plataformas separadas por vírgula: gupy,solides (padrão: ambas)
- `locations` - JSON com localizações (opcional, usa config padrão se não fornecido)

**Exemplos de uso:**

```bash
# Busca básica
curl "http://localhost:3000/jobs"

# Busca específica
curl "http://localhost:3000/jobs?jobSearchTerms=Designer&enableRemote=true&platforms=gupy"

# Busca em múltiplas plataformas
curl "http://localhost:3000/jobs?jobSearchTerms=UX Designer,Product Designer&platforms=gupy,solides"
```

**Resposta de exemplo:**

```json
{
  "success": true,
  "totalJobs": 22,
  "results": [
    {
      "platform": "gupy",
      "jobs": [...],
      "count": 22
    }
  ],
  "searchParams": {
    "jobSearchTerms": ["Designer"],
    "locations": [...],
    "enableRemote": true,
    "platforms": ["gupy"]
  }
}
```

## Configuração

Edite o arquivo `config.json` para ajustar:

- Termos de busca padrão
- Localizações
- Configurações das APIs
- Campos de saída
