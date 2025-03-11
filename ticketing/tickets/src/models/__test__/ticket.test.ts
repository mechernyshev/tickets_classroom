import {Ticket} from "../ticket";

it('Implements OCC', async () => {
    // create an instance of a ticket

    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    // Save a ticket to the DB
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separate changes to the tickets we fetched
    firstInstance!.set({price: 10});
    secondInstance!.set({price: 15});

    // Save the first fetched tickets
    await firstInstance!.save()

    // Save the second fetched ticket and expect an error

    // save the second fetched ticket and expect an error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point')
})

it('Increments version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);

})