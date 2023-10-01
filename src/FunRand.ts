class FunRand {
    static exponential(timeMean: number): number {
        let a = 0;
        while(a === 0) {
            a = Math.random();
        }

        a = -timeMean * Math.log(a);

        return a;
    }
}

export default FunRand