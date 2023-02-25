const identities = [
    {
        prop: ["i", "i"],
        result: [-1]
    }
];

class Expressions {
    static clean1(es) {
        return es.map(e => {
            let c = 1;
            const vars = [];
            const fns = [];
            e.forEach(k => {
                if (typeof k === "number") c *= k;
                else if (typeof k === "string") vars.push(k);
                else if (Array.isArray(k)) fns.push([k[0], k[1].map(Expressions.clean1)]);
            });
            if (c === 0) return null;
            if (c === 1 && (vars.length || fns.length)) return [...vars, ...fns];
            return [c, ...vars, ...fns];
        }).filter(i => i && i.length);
    };

    static clean2(es) {
        let c = 0;
        const other = new Map;
        es.forEach(e => {
            let c1 = null;
            const vars1 = [];
            const fns1 = [];
            e.forEach(k => {
                if (typeof k === "number") {
                    if (c1 === null) c1 = 1;
                    c1 *= k;
                } else if (typeof k === "string") vars1.push(k);
                else if (Array.isArray(k)) fns1.push(k);
            });
            if (c1 === 0) return; // this shouldn't happen since it's the second part
            if (c1 && !vars1.length && !fns1.length) return c += c1;
            const str = Expressions.stringify([[...vars1, ...fns1]], false);
            if (other.has(str)) return other.get(str)[1] += c1 || 1;
            other.set(str, [e.filter(i => typeof i !== "number"), c1 || 1]);
        });
        return [...(c ? [[c]] : []), ...Array.from(other.values()).filter(i => i[1]).map(i => [...(i[1] === 1 ? [] : [i[1]]), ...i[0]])];
    };

    static clean(es) {
        return Expressions.clean2(Expressions.clean1(es));
    };

    static stringify(es, clean = true) {
        if (clean) es = Expressions.clean(es);
        return es.map((i, j) => {
            const s = i.map(j => Array.isArray(j) ? j[0] + "(" + j[1].map(l => Expressions.stringify(l, false)).join(", ") + ")" : j.toString()).join(" * ");
            return (j === 0 ? s : " " + (s[0] === "-" ? "- " + s.substring(1) : "+ " + s));
        }).join("");
    };

    static _toolSplit(str, splitters, plusMinus = false) {
        let b = 0;
        const l = [];
        let k = "";
        let ls = "";
        for (let i = 0; i < str.length; i++) {
            const c = str[i];
            if (c === "(") b++;
            if (c === ")") b--;
            if (!b && splitters.includes(c)) {
                if (k) l.push((plusMinus ? ls : "") + k.trim());
                ls = (c === "-" ? "-" : "");
                k = "";
            } else k += c;
        }
        if (k) l.push((plusMinus ? ls : "") + k.trim());
        return l;
    };

    static parse(str) {
        if (str.split("(").length < str.split(")").length) throw new SyntaxError("Unexpected ')'");
        if (str.split("(").length > str.split(")").length) throw new SyntaxError("Expected '('");
        const plusMinus = Expressions._toolSplit(str, ["+", "-"], true);
        const times = plusMinus.map(i => Expressions._toolSplit(i, ["*"]));
        return times.map(i => i.map(j => {
            if (j.includes("(")) {
                const ind = j.indexOf("(");
                const name = j.substring(0, ind);
                const rest = j.substring(ind + 1, j.length - 1);
                const splitter = Expressions._toolSplit(rest, [","]);
                return [name, splitter.map(i => Expressions.parse(i))];
            }
            return isNaN(j) ? j : j * 1;
        }));
    };

    static add(es1, es2, clean = true) {
        if (typeof es1 === "string") es1 = Expressions.parse(es1);
        if (typeof es2 === "string") es2 = Expressions.parse(es2);
        let r = [...es1, ...es2];
        if (clean) r = Expressions.clean(r);
        return r;
    };

    static multiplyNumber(es, number, clean = true) {
        if (typeof es === "string") es = Expressions.parse(es);
        let r = es.map(i => [...i, number]);
        if (clean) r = Expressions.clean(r);
        return r;
    };

    static subtract(es1, es2, clean = true) {
        return Expressions.add(es1, Expressions.multiplyNumber(es2, -1, false), clean);
    };

    static multiply(es1, es2, clean = true) {
        if (typeof es1 === "string") es1 = Expressions.parse(es1);
        if (typeof es2 === "string") es2 = Expressions.parse(es2);
        let list = [];
        es1.forEach(i => {
            es2.forEach(j => {
                list.push([...i, ...j]);
            });
        });
        if (clean) Expressions.clean(list);
        return list;
    };
}

// TODO: power
// TODO: convert 10x to 10*
// TODO: parentheses
// TODO: identities
// TODO: converting to js function