"use client";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { Layout } from "@/components/layout";
import Link from "next/link";
import { useState, useEffect } from "react";


function getModInfo(boj: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [readme, setReadme] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoResponse = await fetch("https://api.github.com/repos/" + boj.repository);
        const repoData = await repoResponse.json();
        setData(repoData);
        
        const readmeResponse = await fetch(
          `https://raw.githubusercontent.com/${boj.repository}/${repoData.default_branch}/README.md`
        );
        const readmeText = await readmeResponse.text();
        setReadme(readmeText);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boj.repository]); // Only depend on the repository

  return { data, loading, error, readme };
}

export default function ModPage() {
  const params = useParams();
  const modId = params.id as string;
  const modInfo: any = getModInfo({
    repository: decodeURIComponent(modId).replace(":", "/"),
  });

  if (modInfo.loading) {
    return <div>Loading...</div>;
  }

  if (modInfo.error) {
    return <div>Error loading README: {modInfo.error.message}</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="w-full h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">
                  {modInfo.data?.name}
                </CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User size={16} />
                  <span>{modInfo.data?.owner.login}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-lg">{modInfo.data?.description}</p>
              </CardContent>
              <CardFooter className="">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground"></div>
                  <Link href={modInfo.data?.html_url}>
                    <Button>Github</Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Mod Details</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <dl className="space-y-1">
                  <div>
                    <dt className="font-semibold">Language</dt>
                    <dd>
                      <pre>{modInfo.data?.language}</pre>
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Last Updated</dt>
                    <dd>{modInfo.data?.updated_at}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Star count</dt>
                    <dd>{modInfo.data?.stargazers_count}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <ReactMarkdown>{modInfo.readme}</ReactMarkdown>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
