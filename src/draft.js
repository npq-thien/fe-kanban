// Adding column button
  /* <div>
          {!isAddingNewColumn ? (
            <button
              className="btn-secondary border-2 border-orange-500"
              onClick={() => setIsAddingNewColumn(true)}
            >
              Add new column
            </button>
          ) : (
            // Demo new column
            <div className="w-[250px] bg-cream rounded-lg p-2">
              <input
                autoFocus
                className="w-full rounded-md p-1 border-2"
                type="text"
                placeholder="Enter column name"
                onChange={(e) => setNewColumnTitle(e.target.value)}
              />
              <div className="flex gap-4 mt-2">
                <button
                  className="flex-center py-1 gap-2 btn-primary bg-orange-500 w-full"
                  onClick={handleCreateNewColumn}
                >
                  <FaPlus />
                  Add column
                </button>
                <button
                  className="rounded-md p-2 hover:bg-light-3"
                  onClick={() => setIsAddingNewColumn(false)}
                >
                  <MdClose />
                </button>
              </div>
            </div>
          )}
        </div> */
// }

// Logic create column
  // const createNewColumn = (columnTitle: string) => {
  //   const newColumn: Column = {
  //     id: generateId(),
  //     title: columnTitle,
  //   };
  //   setColumns([...columns, newColumn]);
  // };

  // const handleCreateNewColumn = () => {
  //   if (newColumnTitle.trim() !== "") {
  //     createNewColumn(newColumnTitle);
  //     setIsAddingNewColumn(false);
  //     setNewColumnTitle("");
  //   }
  // };