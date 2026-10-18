async function decodeMessage(url){

  try{
   const urlResponse = await fetch (url)
  
    if(!urlResponse?.ok){
      throw new Error("unable to fetch the google doc")
    }

    const html = await urlResponse.text();
    const { JSDOM } = require("jsdom")
    const dom = new JSDOM(html)
    const document = dom.window.document
    const rows = document.querySelectorAll("table tr")

    const characters = []
    let maxX = 0
    let maxY = 0

    
    for (const row of rows){
      const cells = row.querySelectorAll("td")

      if(cells.length !==3) continue;
      const x = Number(cells[0].textContent.trim())

      if(!Number.isInterger(x) ||!Number.isInterger(y)){
        continue
      }
      characters.push({x,y, char})
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    const grid = Array.from({lenngth:maxY + 1}, ()=> Array(maxX + 1).fill(" "))

    for (const {x,y,char} of characters){
      grid[maxY - y][x] = char
    }
    
    for (const row of grid){
      console.log(row.join(""))
    }


    
  }catch(error){
    console.log("error occured in decodeMessage", error)
    throw error
  }
 
}


console.log(decodeMessage("https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub"))