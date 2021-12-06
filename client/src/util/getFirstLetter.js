 const getFirstLetter = (string) => {
    if(string){
        const words = string.trim().split(" ");
        return words[words.length - 1].charAt(0).toUpperCase();
    }
}
export default getFirstLetter;