import json


def get_or_none(d, attr):
    return d[attr] if attr in d else None


def main():
    nodes = {}

    with open("rawdata/nodes.dmp") as nodef:
        for line in nodef.readlines():
            id, parent, rank = [col.strip() for col in line.split("|")][0:3]
            nodes[int(id)] = {"parent": int(parent) if parent != id else None, "rank": rank}

    attrs = set()

    with open("rawdata/names.dmp") as namef:
        for line in namef.readlines():
            id, name, _, clazz, _ = [col.strip() for col in line.split("|")]
            attrs.add(clazz)
            node = nodes[int(id)]
            node[clazz] = name

    res = []
    for id, node in nodes.items():
        name = get_or_none(node, "genbank common name")
        nam2 = get_or_none(node, "common name")
        node = {
            "id": id,
            "parentId": node["parent"],
            "rank": node["rank"],
            "scientific_name": node["scientific name"],
        }
        either_name = name if name is not None else nam2
        if either_name is not None:
            node["name"] = either_name
        res.append(node)

    with open("public/data.json", "w") as resf:
        json.dump(res, resf)


if __name__ == "__main__":
    main()
