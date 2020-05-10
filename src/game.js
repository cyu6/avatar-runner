function resetGame() {
    this.status = "playing";
}

function getStatus() {
    return this.status;
}

export default {
    resetGame,
    getStatus,
    status
};