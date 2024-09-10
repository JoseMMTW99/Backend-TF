class DaoMongo{
    constructor(model) {
        this.model = model;
    }

    getAll = async () => await this.model.find({})
    get = async (gilter) => await this.model.find(filter)
    create = async () => {}
    update = async () => {}
    remove = async () => {}
}