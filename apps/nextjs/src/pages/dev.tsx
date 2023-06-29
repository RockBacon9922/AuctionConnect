import { api } from "~/utils/api";

const DevPage = () => {
  return (
    <div>
      <h1>Dev</h1>
      <CreateLotComp />
      <SetStatusComp />
      <LotTable />
    </div>
  );
};

export default DevPage;

const SetStatusComp = () => {
  const lots = api.lot.all.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const statusMutation = api.lot.setStatusAll.useMutation();
  return (
    <div>
      <h2>Set Status</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const status = e.currentTarget.status.value;
          lots.data?.forEach((lot) => {
            statusMutation.mutate({ id: lot.id, status });
          });
        }}
      >
        <select name="status">
          <option value="upcoming">upcoming</option>
          <option value="live">live</option>
          <option value="closed">closed</option>
        </select>
        <button type="submit">Set Status</button>
      </form>
    </div>
  );
};

const CreateLotComp = () => {
  const lots = api.lot.all.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const createLotMutation = api.lot.create.useMutation({
    onSuccess: () => {
      alert("Lot created");
    },
  });
  return (
    <div>
      <h2>Create Lot</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // @ts-ignore
          const name = e.currentTarget.name.value;
          const description = e.currentTarget.description.value;
          const image = e.currentTarget.image.value;
          const lowEstimate = e.currentTarget.lowEstimate.valueAsNumber;
          const highEstimate = e.currentTarget.highEstimate.valueAsNumber;
          createLotMutation.mutate({
            name,
            description,
            image,
            lowEstimate,
            highEstimate,
          });
          e.currentTarget.reset();
        }}
      >
        <input name="name" placeholder="name" />
        <input name="description" placeholder="description" />
        <input name="image" placeholder="image" />
        <input
          name="lowEstimate"
          placeholder="lowEstimate"
          type="number"
          required
        />
        <input
          name="highEstimate"
          placeholder="highEstimate"
          type="number"
          required
        />
        <button type="submit">Create Lot</button>
      </form>
    </div>
  );
};

const LotTable = () => {
  const lots = api.lot.all.useQuery(undefined, {
    refetchInterval: 3000,
  });
  const deleteLotMutation = api.lot.delete.useMutation({
    onSuccess: () => {
      lots.refetch();
    },
  });
  return (
    <table>
      <thead>
        <tr>
          <th>name</th>
          <th>description</th>
          <th>image</th>
          <th>lowEstimate</th>
          <th>highEstimate</th>
          <th>status</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        {lots.data?.map((lot) => (
          <tr key={lot.id}>
            <td>{lot.name}</td>
            <td>{lot.description}</td>
            <td>{lot.image}</td>
            <td>{lot.lowEstimate}</td>
            <td>{lot.highEstimate}</td>
            <td>{lot.status}</td>
            <td>
              <button
                onClick={() => {
                  deleteLotMutation.mutate({ id: lot.id });
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
