import { cfg } from "./cfg"

/**
 * Utilizar no front, para não depender do relógio do cliente
 * Atualiza a menor data local possível,
 * utilizando um horário remoto do cloudflare
 * Este endpoint é globalmente distribuído, retornando em ~ 20ms
 * Primeira opção era http://www.google.com/generate_204,
 * mas tem CORS e fetch não consegue ler o header Date.
 */
export async function sync() {
  try {
    const response = await fetch("https://cloudflare.com/cdn-cgi/trace")
    const body = await response.text()
    // ts=1758014351.022
    const ts = body.match(/\nts=(\d{10}(\.\d+)?)\n/)?.at(1)
    if (ts) {
      const minTs = Math.round(Number.parseFloat(ts) * 1000)
      if (Number.isInteger(minTs))
      cfg.minTs = minTs
    }
  } catch (e) {
    console.error(e)
  }
}
