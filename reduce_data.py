import json


def reduce(nodes):
    custom_root_name = "Eukaryota"
    nodes_by_id = {}
    custom_root = None
    for node in nodes:
        nodes_by_id[node["id"]] = node
        node["children"] = []

        if node["scientific_name"] == custom_root_name:
            custom_root = node["id"]
            node["parentId"] = None

    for node in nodes:
        if node["parentId"] is not None:
            parent = nodes_by_id[node["parentId"]]
            parent["children"].append(node["id"])

    from_custom_root = []
    to_go = {custom_root}
    while len(to_go) > 0:
        curr = to_go.pop()
        node = nodes_by_id[curr]
        from_custom_root.append(node)
        for child in node["children"]:
            to_go.add(child)

    for node in from_custom_root:
        del node["children"]

    print(len(from_custom_root))

    return from_custom_root


def main():
    newdata = []

    with open("public/data.json") as dataf:
        nodes = json.load(dataf)
        newdata = reduce(nodes)

    with open("public/reduceddata.json", "w") as dataf:
        json.dump(newdata, dataf)


if __name__ == "__main__":
    main()
